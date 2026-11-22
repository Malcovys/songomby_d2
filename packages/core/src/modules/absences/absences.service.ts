import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  Absence,
  CreateAbsence,
  ListAbsencesQuery,
  PaginatedAbsences,
  UpdateAbsence,
} from '@nexora/contracts';
import { Prisma } from '../../platform/prisma/generated/client.ts';
import { PrismaService } from '../../platform/prisma/prisma.service.ts';

const ABSENCE_INCLUDE = {
  employee: { select: { id: true, matricule: true, firstName: true, lastName: true } },
} satisfies Prisma.AbsenceInclude;

type AbsenceRow = Prisma.AbsenceGetPayload<{ include: typeof ABSENCE_INCLUDE }>;

const toDate = (value: string): Date => new Date(`${value}T00:00:00.000Z`);

function toAbsence(row: AbsenceRow): Absence {
  return {
    id: row.id,
    employeeId: row.employeeId,
    employee: row.employee,
    date: row.date.toISOString().slice(0, 10),
    justified: row.justified,
    reason: row.reason,
    createdAt: row.createdAt.toISOString(),
  };
}

const notFound = () =>
  new NotFoundException({ code: 'absence_not_found', message: 'Absence introuvable' });

@Injectable()
export class AbsencesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListAbsencesQuery): Promise<PaginatedAbsences> {
    const { page, limit, employeeId, justified, from, to } = query;

    const where: Prisma.AbsenceWhereInput = {
      ...(employeeId && { employeeId }),
      ...(justified !== undefined && { justified }),
      ...((from || to) && {
        date: {
          ...(from && { gte: toDate(from) }),
          ...(to && { lte: toDate(to) }),
        },
      }),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.absence.findMany({
        where,
        include: ABSENCE_INCLUDE,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.absence.count({ where }),
    ]);

    return { items: rows.map(toAbsence), page, limit, total };
  }

  async get(id: string): Promise<Absence> {
    const row = await this.prisma.absence.findUnique({ where: { id }, include: ABSENCE_INCLUDE });
    if (!row) throw notFound();
    return toAbsence(row);
  }

  async create(input: CreateAbsence): Promise<Absence> {
    const employee = await this.prisma.employee.findUnique({ where: { id: input.employeeId } });
    if (!employee) {
      throw new NotFoundException({ code: 'employee_not_found', message: 'Employé introuvable' });
    }

    const date = toDate(input.date);

    const existing = await this.prisma.absence.findFirst({
      where: { employeeId: input.employeeId, date },
    });
    if (existing) {
      throw new ConflictException({
        code: 'absence_duplicate',
        message: 'Une absence est déjà enregistrée pour cet employé à cette date',
      });
    }

    const row = await this.prisma.absence.create({
      data: {
        employeeId: input.employeeId,
        date,
        justified: input.justified,
        reason: input.reason,
      },
      include: ABSENCE_INCLUDE,
    });
    return toAbsence(row);
  }

  async update(id: string, input: UpdateAbsence): Promise<Absence> {
    try {
      const row = await this.prisma.absence.update({
        where: { id },
        data: input,
        include: ABSENCE_INCLUDE,
      });
      return toAbsence(row);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.absence.delete({ where: { id } });
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private mapError(error: unknown): unknown {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return notFound();
    }
    return error;
  }
}