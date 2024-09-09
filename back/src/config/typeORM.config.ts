import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export function typeormcon(configService: ConfigService) {
  const option: TypeOrmModuleOptions = {
    type: `mysql`,
    host: configService.get<string>(`HOST`),
    username: configService.get<string>(`USERNAME`),
    password: configService.get<string>(`PASSWORD`),
    database: configService.get<string>(`DATABASE`),
    synchronize: configService.get<boolean>(`SYNCHRONIZE`),
    autoLoadEntities: true,
    namingStrategy: new SnakeNamingStrategy(),
    // logging: true,
  };
  return option;
}
