import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import type { AppConfig } from './app.config.ts';
import type { DbConfig } from './db.config.ts';
import type { StorageConfig } from './storage.config.ts';

interface IConfigs extends AppConfig, DbConfig, StorageConfig {}

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService<IConfigs, true>) {}

  get app() {
    return this.nestConfigService.get('app', { infer: true });
  }

  get db() {
    return this.nestConfigService.get('db', { infer: true });
  }

  get storage() {
    return this.nestConfigService.get('storage', { infer: true });
  }
}
