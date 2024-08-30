import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { Request } from 'express';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { AUTH_SERVICE } from '../constants';
import { IS_PUBLIC } from '../decorators';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AUTH_SERVICE) private readonly authClientProxy: ClientProxy,
  ) {}
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest() satisfies Request;
    const bearer = request.headers.authorization;
    const cookie = request.cookies['Authorization'];

    if (!bearer && !cookie) throw new UnauthorizedException();

    return this.authClientProxy
      .send<User>(
        { cmd: 'authorize' },
        new RmqRecordBuilder().setData({ bearer, cookie }).build(),
      )
      .pipe(
        tap((user: User) => {
          request.user = user;
          request.authInfo = bearer || cookie;
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(err);

          return throwError(() => new UnauthorizedException());
        }),
      );
  }
}
