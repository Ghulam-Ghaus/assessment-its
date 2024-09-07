import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LogModule } from './log/log.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Log } from './log/entities/log.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables globally
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PGHOST'),
        port: 5432,
        database: configService.get<string>('PGDATABASE'),
        username: configService.get<string>('PGUSER'),
        password: configService.get<string>('PGPASSWORD'),
        ssl: { rejectUnauthorized: false }, // For secure connection
        extra: {
          options: `project=${configService.get<string>('ENDPOINT_ID')}`, // Endpoint project ID
        },
        entities: [User, Log],
        synchronize: true,
      }),
    }),
    UserModule,
    LogModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
