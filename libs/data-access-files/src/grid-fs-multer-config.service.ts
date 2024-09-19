import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { GridFsStorage } from './gridfs-storage';

@Injectable()
export class GridFsMulterConfigService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: new GridFsStorage(
        this.configService.getOrThrow<string>('MONGO_URL'),
      ),
    };
  }
}
