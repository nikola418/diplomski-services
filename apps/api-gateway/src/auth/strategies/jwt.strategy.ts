import { AUTH_SERVICE, JWTPayload } from '@libs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientRMQ } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import {
  ExtractJwt,
  Strategy,
  StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AUTH_SERVICE) private readonly client: ClientRMQ,
  ) {
    super(<StrategyOptionsWithoutRequest>{
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request) => request?.cookies?.Authorization,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  public validate({ id }: JWTPayload): Observable<User> {
    return this.client.send<User>('findOne', { id });
  }
}
