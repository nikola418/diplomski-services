import { UsersService } from '@libs/data-access-users';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super(<StrategyOptionsWithoutRequest>{
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) =>
          request?.cookies?.Authentication ||
          request?.Authentication ||
          request?.headers?.Authentication,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  public validate({ id }: User): Promise<User> {
    return this.usersService.findOne({ id });
  }
}
