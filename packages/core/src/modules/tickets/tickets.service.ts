import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateTicket,
  ListTicketsQuery,
  PaginatedTickets,
  Ticket,
  UpdateTicket,
} from '@nexora/contracts';
import { Prisma } from '../../platform/prisma/generated/client.ts';
import { PrismaService } from '../../platform/prisma/prisma.service.ts';

const TICKET_INCLUDE = {
  employee: { select: { id: true, matricule: true, firstName: true, lastName: true } },
} satisfies Prisma.TicketInclude;

type TicketRow = Prisma.TicketGetPayload<{ include: typeof TICKET_INCLUDE }>;

function toTicket(row: TicketRow): Ticket {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    employeeId: row.employeeId,
    employee: row.employee,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const notFound = () =>
  new NotFoundException({ code: 'ticket_not_found', message: 'Ticket introuvable' });

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListTicketsQuery): Promise<PaginatedTickets> {
    const { page, limit, search, status, priority, employeeId } = query;

    const where: Prisma.TicketWhereInput = {
      ...(status && { status }),
      ...(priority && { priority }),
      ...(employeeId && { employeeId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.ticket.findMany({
        where,
        include: TICKET_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return { items: rows.map(toTicket), page, limit, total };
  }

  async get(id: string): Promise<Ticket> {
    const row = await this.prisma.ticket.findUnique({ where: { id }, include: TICKET_INCLUDE });
    if (!row) throw notFound();
    return toTicket(row);
  }

  async create(input: CreateTicket): Promise<Ticket> {
    if (input.employeeId) await this.assertEmployeeExists(input.employeeId);

    const row = await this.prisma.ticket.create({
      data: input,
      include: TICKET_INCLUDE,
    });
    return toTicket(row);
  }

  async update(id: string, input: UpdateTicket): Promise<Ticket> {
    if (input.employeeId) await this.assertEmployeeExists(input.employeeId);

    try {
      const row = await this.prisma.ticket.update({
        where: { id },
        data: input,
        include: TICKET_INCLUDE,
      });
      return toTicket(row);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.ticket.delete({ where: { id } });
    } catch (error) {
      throw this.mapError(error);
    }
  }

  private async assertEmployeeExists(employeeId: string): Promise<void> {
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      select: { id: true },
    });
    if (!employee) {
      throw new NotFoundException({ code: 'employee_not_found', message: 'Employé introuvable' });
    }
  }

  private mapError(error: unknown): unknown {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return notFound();
    }
    return error;
  }
}