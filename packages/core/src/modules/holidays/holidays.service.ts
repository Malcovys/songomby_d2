import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateHoliday,
  CreateHolidays,
  CreateHolidaysResult,
  Holiday,
  ListHolidaysQuery,
} from '@nexora/contracts';
import { Prisma } from '../../platform/prisma/generated/client.ts';
import type { Holiday as HolidayRow } from '../../platform/prisma/generated/client.ts';
import { PrismaService } from '../../platform/prisma/prisma.service.ts';

const toDate = (value: string): Date => new Date(`${value}T00:00:00.000Z`);

function toHoliday(row: HolidayRow): Holiday {
  return {
    id: row.id,
    date: row.date.toISOString().slice(0, 10),
    name: row.name,
    createdAt: row.createdAt.toISOString(),
  };
}

@Injectable()
export class HolidaysService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListHolidaysQuery): Promise<Holiday[]> {
    const { year } = query;
    const rows = await this.prisma.holiday.findMany({
      where: year
        ? { date: { gte: new Date(Date.UTC(year, 0, 1)), lt: new Date(Date.UTC(year + 1, 0, 1)) } }
        : undefined,
      orderBy: { date: 'asc' },
    });
    return rows.map(toHoliday);
  }

  async create(input: CreateHoliday): Promise<Holiday> {
    try {
      const row = await this.prisma.holiday.create({
        data: { date: toDate(input.date), name: input.name },
      });
      return toHoliday(row);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException({
          code: 'holiday_duplicate',
          message: 'Un jour férié existe déjà à cette date',
        });
      }
      throw error;
    }
  }

  // Les dates déjà présentes sont ignorées, pas d'erreur
  async createMany(input: CreateHolidays): Promise<CreateHolidaysResult> {
    const result = await this.prisma.holiday.createMany({
      data: input.items.map((item) => ({ date: toDate(item.date), name: item.name })),
      skipDuplicates: true,
    });
    return { created: result.count, skipped: input.items.length - result.count };
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.holiday.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException({
          code: 'holiday_not_found',
          message: 'Jour férié introuvable',
        });
      }
      throw error;
    }
  }
}