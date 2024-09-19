import { DataAccessUsersModule } from '@libs/data-access-users';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthConsumerController } from './auth-consumer.controller';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(
            configService.getOrThrow<string>('JWT_EXPIRES_IN'),
          ),
        },
      }),
      inject: [ConfigService],
    }),
    DataAccessUsersModule,
  ],
  controllers: [AuthController, AuthConsumerController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
