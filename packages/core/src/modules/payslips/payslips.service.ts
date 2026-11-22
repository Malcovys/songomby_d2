import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  ListPayslipsQuery,
  PaginatedPayslips,
  Payslip,
  PayslipInput,
  PayslipPreview,
} from '@nexora/contracts';
import { Prisma } from '../../platform/prisma/generated/client.ts';
import { PrismaService } from '../../platform/prisma/prisma.service.ts';
import { countWorkingDays } from '../leaves/working-days.ts';

const CURRENCY = 'MGA';

const PAYSLIP_INCLUDE = {
  employee: { select: { id: true, matricule: true, firstName: true, lastName: true } },
} satisfies Prisma.PayslipInclude;

type PayslipRow = Prisma.PayslipGetPayload<{ include: typeof PAYSLIP_INCLUDE }>;

const toDay = (value: Date): string => value.toISOString().slice(0, 10);

function toPayslip(row: PayslipRow): Payslip {
  return {
    id: row.id,
    employeeId: row.employeeId,
    employee: row.employee,
    month: row.month,
    year: row.year,
    baseSalary: row.baseSalary.toString(),
    deductions: row.deductions.toString(),
    bonuses: row.bonuses.toString(),
    netSalary: row.netSalary.toString(),
    currency: row.currency,
    status: row.status,
    pdfUrl: row.pdfUrl,
    generatedAt: row.generatedAt ? row.generatedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  };
}

const notFound = () =>
  new NotFoundException({ code: 'payslip_not_found', message: 'Fiche de paie introuvable' });

@Injectable()
export class PayslipsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListPayslipsQuery): Promise<PaginatedPayslips> {
    const { page, limit, employeeId, month, year } = query;

    const where: Prisma.PayslipWhereInput = {
      ...(employeeId && { employeeId }),
      ...(month && { month }),
      ...(year && { year }),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.payslip.findMany({
        where,
        include: PAYSLIP_INCLUDE,
        orderBy: [{ year: 'desc' }, { month: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payslip.count({ where }),
    ]);

    return { items: rows.map(toPayslip), page, limit, total };
  }

  async get(id: string): Promise<Payslip> {
    const row = await this.prisma.payslip.findUnique({ where: { id }, include: PAYSLIP_INCLUDE });
    if (!row) throw notFound();
    return toPayslip(row);
  }

  // Calcule sans rien enregistrer
  async preview(input: PayslipInput): Promise<PayslipPreview> {
    const calc = await this.compute(input);
    return {
      employee: calc.employee,
      month: input.month,
      year: input.year,
      workingDays: calc.workingDays,
      unpaidLeaveDays: calc.unpaidLeaveDays,
      unjustifiedAbsences: calc.unjustifiedAbsences,
      dailyRate: calc.dailyRate.toFixed(2),
      baseSalary: calc.baseSalary.toFixed(2),
      deductions: calc.deductions.toFixed(2),
      bonuses: calc.bonuses.toFixed(2),
      netSalary: calc.netSalary.toFixed(2),
      currency: CURRENCY,
    };
  }

  // Calcule puis enregistre
  async generate(input: PayslipInput): Promise<Payslip> {
    const calc = await this.compute(input);

    try {
      const row = await this.prisma.payslip.create({
        data: {
          employeeId: input.employeeId,
          month: input.month,
          year: input.year,
          baseSalary: calc.baseSalary,
          deductions: calc.deductions,
          bonuses: calc.bonuses,
          netSalary: calc.netSalary,
          currency: CURRENCY,
        },
        include: PAYSLIP_INCLUDE,
      });
      return toPayslip(row);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException({
          code: 'payslip_exists',
          message: 'Une fiche de paie existe déjà pour cet employé et ce mois',
        });
      }
      throw error;
    }
  }

  // Supprime pour pouvoir régénérer
  async remove(id: string): Promise<void> {
    try {
      await this.prisma.payslip.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw notFound();
      }
      throw error;
    }
  }

  // ---------- Règles de calcul (à adapter plus tard) ----------
  private async compute(input: PayslipInput) {
    const { employeeId, month, year } = input;

    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        matricule: true,
        firstName: true,
        lastName: true,
        baseSalary: true,
        hireDate: true,
      },
    });
    if (!employee) {
      throw new NotFoundException({ code: 'employee_not_found', message: 'Employé introuvable' });
    }

    const first = new Date(Date.UTC(year, month - 1, 1));
    const last = new Date(Date.UTC(year, month, 0));

    if (employee.hireDate > last) {
      throw new BadRequestException({
        code: 'payslip_before_hire',
        message: "L'employé n'était pas encore embauché ce mois-là",
      });
    }

    const holidayRows = await this.prisma.holiday.findMany({
      where: { date: { gte: first, lte: last } },
      select: { date: true },
    });
    const holidays = new Set(holidayRows.map((holiday) => toDay(holiday.date)));
    const workingDays = countWorkingDays(first, last, holidays);

    // Congés sans solde approuvés qui touchent le mois (on ne compte que la part dans le mois)
    const unpaidLeaves = await this.prisma.leaveRequest.findMany({
      where: {
        employeeId,
        type: 'UNPAID',
        status: 'APPROVED',
        startDate: { lte: last },
        endDate: { gte: first },
      },
      select: { startDate: true, endDate: true },
    });
    const unpaidLeaveDays = unpaidLeaves.reduce((sum, leave) => {
      const start = leave.startDate > first ? leave.startDate : first;
      const end = leave.endDate < last ? leave.endDate : last;
      return sum + countWorkingDays(start, end, holidays);
    }, 0);

    const unjustifiedAbsences = await this.prisma.absence.count({
      where: { employeeId, justified: false, date: { gte: first, lte: last } },
    });

    const baseSalary = employee.baseSalary;
    const dailyRate = baseSalary.div(workingDays);
    const rawDeductions = dailyRate.mul(unpaidLeaveDays + unjustifiedAbsences);
    const deductions = Prisma.Decimal.min(rawDeductions, baseSalary).toDecimalPlaces(2);
    const bonuses = new Prisma.Decimal(input.bonuses).toDecimalPlaces(2);
    const netSalary = baseSalary.minus(deductions).plus(bonuses);

    return {
      employee: {
        id: employee.id,
        matricule: employee.matricule,
        firstName: employee.firstName,
        lastName: employee.lastName,
      },
      workingDays,
      unpaidLeaveDays,
      unjustifiedAbsences,
      dailyRate,
      baseSalary,
      deductions,
      bonuses,
      netSalary,
    };
  }
}