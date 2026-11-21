import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import type { Liveness, Readiness } from '@nexora/contracts';
import { Redis } from 'ioredis';
import { PrismaService } from '../prisma/prisma.service.ts';
import { REDIS_CLIENT } from '../redis/redis.module.ts';

const PROBE_TIMEOUT_MS = 2000;

type CheckResult = Readiness['checks'][string];

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  @Get('live')
  live(): Liveness {
    return { status: 'ok' };
  }

  @Get('ready')
  async ready(): Promise<Readiness> {
    const [database, redis] = await Promise.all([
      this.probe(() => this.prisma.$queryRaw`SELECT 1`),
      this.probe(() => this.redis.ping()),
    ]);
    const checks = { database, redis };
    const degraded = Object.values(checks).includes('degraded');
    const readiness: Readiness = { status: degraded ? 'degraded' : 'ok', checks };
    if (degraded) {
      throw new ServiceUnavailableException(readiness);
    }
    return readiness;
  }

  private async probe(check: () => Promise<unknown>): Promise<CheckResult> {
    try {
      await Promise.race([check(), this.timeout()]);
      return 'ok';
    } catch {
      return 'degraded';
    }
  }

  private timeout(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Health probe timed out')), PROBE_TIMEOUT_MS).unref();
    });
  }
}
