import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT, RedisModule } from '../redis/redis.module.ts';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [RedisModule],
      inject: [REDIS_CLIENT],
      useFactory: (connection: Redis) => ({ connection }),
    }),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
