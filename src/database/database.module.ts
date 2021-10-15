import { Client } from 'pg';
import { ConfigType } from '@nestjs/config';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from '../config';

const API_KEY = '12345634';
const API_KEY_PROD = 'production1234';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        let ssl;

        if (process.env.NODE_ENV !== 'prod') ssl = false;
        else ssl = { rejectUnauthorized: false };

        return {
          entities: ['dist/**/*.entity{.ts,.js}'],
          retryAttempts: 10,
          retryDelay: 3000,
          ssl,
          type: 'postgres',
          url: configService.postgresURL,
        };
      },
      inject: [config.KEY],
    }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    {
      provide: 'PG',
      useFactory: (configService: ConfigType<typeof config>) => {
        let ssl;

        if (process.env.NODE_ENV !== 'prod') ssl = false;
        else ssl = { rejectUnauthorized: false };

        const client = new Client({
          connectionString: configService.postgresURL,
          ssl,
        });

        client.connect();

        return client;
      },
      inject: [config.KEY],
    },
  ],
  exports: ['API_KEY', 'PG'],
})
export class DatabaseModule {}
