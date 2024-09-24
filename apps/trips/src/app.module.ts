import { AUTH_SERVICE, JwtAuthGuard } from '@libs/common';
import { UserEntity } from '@libs/data-access-users';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { $Enums } from '@prisma/client';
import { CaslModule } from 'nest-casl';
import { PrismaModule } from 'nestjs-prisma';
import { TripsModule } from './trips/trips.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AttendancesModule } from './attendances/attendances.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    CaslModule.forRoot({
      superuserRole: $Enums.Role.Admin,
      getUserFromRequest: (req) => new UserEntity(req.user),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RMQ_URL')],
            queue: 'auth',
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ScheduleModule.forRoot(),
    RouterModule.register([
      { path: 'trips/:tripId', module: AttendancesModule },
    ]),
    TripsModule,
    AttendancesModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
