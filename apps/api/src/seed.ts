import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { PrismaService } from '@nexora/core';
import { AppModule } from './app.module.ts';

function dateOffset(days: number): Date {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

async function seed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  try {
    const prisma = app.get(PrismaService);

    await prisma.$transaction(async (tx) => {
      await tx.employee.upsert({
        where: { id: 'seed-demo-employee-aina' },
        update: {},
        create: {
          id: 'seed-demo-employee-aina',
          matricule: 'DEMO-001',
          firstName: 'Aina',
          lastName: 'Démo',
          email: 'aina.demo@example.invalid',
          position: 'Assistante RH',
          department: 'DÉMO',
          contractType: 'CDI',
          status: 'ACTIVE',
          hireDate: new Date('2024-01-15T00:00:00.000Z'),
          baseSalary: 1_200_000,
          leaveBalanceDays: 24,
        },
      });

      await tx.employee.upsert({
        where: { id: 'seed-demo-employee-toky' },
        update: {},
        create: {
          id: 'seed-demo-employee-toky',
          matricule: 'DEMO-002',
          firstName: 'Toky',
          lastName: 'Exemple',
          email: 'toky.demo@example.invalid',
          position: 'Gestionnaire de paie',
          department: 'DÉMO',
          contractType: 'CDD',
          status: 'ACTIVE',
          hireDate: new Date('2023-08-01T00:00:00.000Z'),
          baseSalary: 950_000,
          leaveBalanceDays: 18,
        },
      });

      await tx.employee.upsert({
        where: { id: 'seed-demo-employee-soa' },
        update: {},
        create: {
          id: 'seed-demo-employee-soa',
          matricule: 'DEMO-003',
          firstName: 'Soa',
          lastName: 'Fictif',
          email: 'soa.demo@example.invalid',
          position: 'Comptable',
          department: 'DÉMO',
          contractType: 'CDI',
          status: 'ACTIVE',
          hireDate: new Date('2022-05-10T00:00:00.000Z'),
          baseSalary: 1_050_000,
          leaveBalanceDays: 27,
        },
      });

      await tx.leaveRequest.upsert({
        where: { id: 'seed-demo-leave-pending' },
        update: {},
        create: {
          id: 'seed-demo-leave-pending',
          employeeId: 'seed-demo-employee-aina',
          type: 'ANNUAL',
          status: 'PENDING',
          startDate: dateOffset(7),
          endDate: dateOffset(9),
          days: 3,
          reason: 'Demande de démonstration',
        },
      });

      await tx.leaveRequest.upsert({
        where: { id: 'seed-demo-leave-approved' },
        update: {},
        create: {
          id: 'seed-demo-leave-approved',
          employeeId: 'seed-demo-employee-toky',
          type: 'ANNUAL',
          status: 'APPROVED',
          startDate: dateOffset(-35),
          endDate: dateOffset(-32),
          days: 4,
          reason: 'Demande de démonstration',
        },
      });

      await tx.absence.upsert({
        where: { id: 'seed-demo-absence' },
        update: {},
        create: {
          id: 'seed-demo-absence',
          employeeId: 'seed-demo-employee-soa',
          date: dateOffset(-2),
          justified: true,
          reason: 'Absence de démonstration',
        },
      });

      const previousMonth = new Date();
      previousMonth.setUTCDate(1);
      previousMonth.setUTCMonth(previousMonth.getUTCMonth() - 1);
      const month = previousMonth.getUTCMonth() + 1;
      const year = previousMonth.getUTCFullYear();

      await tx.payslip.upsert({
        where: {
          employeeId_month_year: {
            employeeId: 'seed-demo-employee-aina',
            month,
            year,
          },
        },
        update: {},
        create: {
          id: 'seed-demo-payslip',
          employeeId: 'seed-demo-employee-aina',
          month,
          year,
          baseSalary: 1_200_000,
          deductions: 120_000,
          bonuses: 50_000,
          netSalary: 1_130_000,
          currency: 'MGA',
          status: 'GENERATED',
          generatedAt: dateOffset(-10),
        },
      });

      await tx.ticket.upsert({
        where: { id: 'seed-demo-ticket-onboarding' },
        update: {},
        create: {
          id: 'seed-demo-ticket-onboarding',
          title: '[DÉMO] Préparer l’accueil d’un nouvel employé',
          description: 'Ticket fictif pour présenter le suivi des tâches.',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          employeeId: 'seed-demo-employee-aina',
        },
      });

      await tx.ticket.upsert({
        where: { id: 'seed-demo-ticket-calendar' },
        update: {},
        create: {
          id: 'seed-demo-ticket-calendar',
          title: '[DÉMO] Vérifier le calendrier RH',
          description: 'Ticket fictif sans action opérationnelle.',
          status: 'OPEN',
          priority: 'HIGH',
        },
      });
    });

    console.info('Demo database seed completed.');
  } finally {
    await app.close();
  }
}

void seed().catch((error: unknown) => {
  console.error('Demo database seed failed.', error);
  process.exitCode = 1;
});
