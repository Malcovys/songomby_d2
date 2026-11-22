import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateEmployee,
  Employee,
  ListEmployeesQuery,
  PaginatedEmployees,
  UpdateEmployee,
} from '@nexora/contracts';
import { Prisma } from '../../platform/prisma/generated/client.ts';
import type { Employee as EmployeeRow } from '../../platform/prisma/generated/client.ts';
import { PrismaService } from '../../platform/prisma/prisma.service.ts';

const SORTABLE_FIELDS = ['lastName', 'firstName', 'matricule', 'hireDate', 'createdAt'] as const;

const toDate = (value: string): Date => new Date(`${value}T00:00:00.000Z`);
const toDay = (value: Date): string => value.toISOString().slice(0, 10);

function toEmployee(row: EmployeeRow): Employee {
  return {
    id: row.id,
    matricule: row.matricule,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    position: row.position,
    department: row.department,
    contractType: row.contractType,
    status: row.status,
    hireDate: toDay(row.hireDate),
    endDate: row.endDate ? toDay(row.endDate) : null,
    baseSalary: row.baseSalary.toString(),
    leaveBalanceDays: row.leaveBalanceDays.toString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListEmployeesQuery): Promise<PaginatedEmployees> {
    const { page, limit, sort, search, department, status, contractType } = query;

    const where: Prisma.EmployeeWhereInput = {
      ...(department && { department }),
      ...(status && { status }),
      ...(contractType && { contractType }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { matricule: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.employee.findMany({
        where,
        orderBy: this.buildOrderBy(sort),
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.employee.count({ where }),
    ]);

    return { items: rows.map(toEmployee), page, limit, total };
  }

  async get(id: string): Promise<Employee> {
    const row = await this.prisma.employee.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException({ code: 'employee_not_found', message: 'Employé introuvable' });
    }
    return toEmployee(row);
  }

  async create(input: CreateEmployee): Promise<Employee> {
    try {
      const row = await this.prisma.employee.create({
        data: {
          ...input,
          hireDate: toDate(input.hireDate),
          endDate: input.endDate ? toDate(input.endDate) : undefined,
        },
      });
      return toEmployee(row);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async update(id: string, input: UpdateEmployee): Promise<Employee> {
    try {
      const row = await this.prisma.employee.update({
        where: { id },
        data: {
          ...input,
          hireDate: input.hireDate ? toDate(input.hireDate) : undefined,
          endDate: input.endDate ? toDate(input.endDate) : undefined,
        },
      });
      return toEmployee(row);
    } catch (error) {
      throw this.mapError(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.employee.delete({ where: { id } });
    } catch (error) {
      throw this.mapError(error);
    }
  }

  // "lastName" = croissant, "-createdAt" = décroissant
  private buildOrderBy(sort?: string): Prisma.EmployeeOrderByWithRelationInput[] {
    if (sort) {
      const desc = sort.startsWith('-');
      const field = desc ? sort.slice(1) : sort;
      if ((SORTABLE_FIELDS as readonly string[]).includes(field)) {
        return [{ [field]: desc ? 'desc' : 'asc' }];
      }
    }
    return [{ lastName: 'asc' }, { firstName: 'asc' }];
  }

  private mapError(error: unknown): unknown {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return new NotFoundException({ code: 'employee_not_found', message: 'Employé introuvable' });
      }
      if (error.code === 'P2002') {
        return new ConflictException({
          code: 'employee_duplicate',
          message: 'Matricule ou email déjà utilisé',
        });
      }
    }
    return error;
  }
}