import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateLeave,
  Leave,
  ListLeavesQuery,
  PaginatedLeaves,
  UpdateLeaveStatus,
} from '@nexora/contracts';
import type { Prisma } from '../../platform/prisma/generated/client.ts';
import { PrismaService } from '../../platform/prisma/prisma.service.ts';
import { countWorkingDays } from './working-days.ts';

const LEAVE_INCLUDE = {
  employee: { select: { id: true, matricule: true, firstName: true, lastName: true } },
} satisfies Prisma.LeaveRequestInclude;

type LeaveRow = Prisma.LeaveRequestGetPayload<{ include: typeof LEAVE_INCLUDE }>;

type LeaveStatusValue = Leave['status'];

const TRANSITIONS: Record<LeaveStatusValue, LeaveStatusValue[]> = {
  PENDING: ['APPROVED', 'REJECTED', 'CANCELLED'],
  APPROVED: ['CANCELLED'],
  REJECTED: [],
  CANCELLED: [],
};

const toDate = (value: string): Date => new Date(`${value}T00:00:00.000Z`);
const toDay = (value: Date): string => value.toISOString().slice(0, 10);

function toLeave(row: LeaveRow): Leave {
  return {
    id: row.id,
    employeeId: row.employeeId,
    employee: row.employee,
    type: row.type,
    status: row.status,
    startDate: toDay(row.startDate),
    endDate: toDay(row.endDate),
    days: row.days.toString(),
    reason: row.reason,
    certificateRef: row.certificateRef,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const notFound = () =>
  new NotFoundException({ code: 'leave_not_found', message: 'Congé introuvable' });

@Injectable()
export class LeavesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListLeavesQuery): Promise<PaginatedLeaves> {
    const { page, limit, employeeId, type, status, from, to } = query;

    const where: Prisma.LeaveRequestWhereInput = {
      ...(employeeId && { employeeId }),
      ...(type && { type }),
      ...(status && { status }),
      ...(from && { endDate: { gte: toDate(from) } }),
      ...(to && { startDate: { lte: toDate(to) } }),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.leaveRequest.findMany({
        where,
        include: LEAVE_INCLUDE,
        orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.leaveRequest.count({ where }),
    ]);

    return { items: rows.map(toLeave), page, limit, total };
  }

  async get(id: string): Promise<Leave> {
    const row = await this.prisma.leaveRequest.findUnique({
      where: { id },
      include: LEAVE_INCLUDE,
    });
    if (!row) throw notFound();
    return toLeave(row);
  }

  async create(input: CreateLeave): Promise<Leave> {
    const start = toDate(input.startDate);
    const end = toDate(input.endDate);

    if (end < start) {
      throw new BadRequestException({
        code: 'leave_invalid_dates',
        message: 'La date de fin est avant la date de début',
      });
    }

    const employee = await this.prisma.employee.findUnique({ where: { id: input.employeeId } });
    if (!employee) {
      throw new NotFoundException({ code: 'employee_not_found', message: 'Employé introuvable' });
    }

    const holidayRows = await this.prisma.holiday.findMany({
      where: { date: { gte: start, lte: end } },
      select: { date: true },
    });
    const holidays = new Set(holidayRows.map((holiday) => toDay(holiday.date)));
    const days = countWorkingDays(start, end, holidays);

    if (days === 0) {
      throw new BadRequestException({
        code: 'leave_no_working_days',
        message: 'La période ne contient aucun jour ouvré',
      });
    }

    const overlap = await this.prisma.leaveRequest.findFirst({
      where: {
        employeeId: input.employeeId,
        status: { in: ['PENDING', 'APPROVED'] },
        startDate: { lte: end },
        endDate: { gte: start },
      },
    });
    if (overlap) {
      throw new ConflictException({
        code: 'leave_overlap',
        message: 'Cet employé a déjà un congé sur cette période',
      });
    }

    if (input.type === 'ANNUAL' && employee.leaveBalanceDays.lt(days)) {
      throw new ConflictException({
        code: 'leave_insufficient_balance',
        message: `Solde insuffisant : ${employee.leaveBalanceDays.toString()} jour(s) restant(s), ${days} demandé(s)`,
      });
    }

    const row = await this.prisma.leaveRequest.create({
      data: {
        employeeId: input.employeeId,
        type: input.type,
        startDate: start,
        endDate: end,
        days,
        reason: input.reason,
        certificateRef: input.certificateRef,
      },
      include: LEAVE_INCLUDE,
    });
    return toLeave(row);
  }

  async updateStatus(id: string, input: UpdateLeaveStatus): Promise<Leave> {
    const next = input.status;

    return this.prisma.$transaction(async (tx) => {
      const leave = await tx.leaveRequest.findUnique({ where: { id } });
      if (!leave) throw notFound();

      if (!TRANSITIONS[leave.status].includes(next)) {
        throw new ConflictException({
          code: 'leave_invalid_transition',
          message: `Impossible de passer de ${leave.status} à ${next}`,
        });
      }

      if (leave.type === 'ANNUAL') {
        if (next === 'APPROVED') {
          const employee = await tx.employee.findUniqueOrThrow({ where: { id: leave.employeeId } });
          if (employee.leaveBalanceDays.lt(leave.days)) {
            throw new ConflictException({
              code: 'leave_insufficient_balance',
              message: 'Solde de congés insuffisant pour approuver',
            });
          }
          await tx.employee.update({
            where: { id: leave.employeeId },
            data: { leaveBalanceDays: { decrement: leave.days } },
          });
        } else if (leave.status === 'APPROVED' && next === 'CANCELLED') {
          await tx.employee.update({
            where: { id: leave.employeeId },
            data: { leaveBalanceDays: { increment: leave.days } },
          });
        }
      }

      const row = await tx.leaveRequest.update({
        where: { id },
        data: { status: next },
        include: LEAVE_INCLUDE,
      });
      return toLeave(row);
    });
  }
}