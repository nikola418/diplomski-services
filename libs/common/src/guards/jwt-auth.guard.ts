import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { Request } from 'express';
import { IncomingMessage } from 'http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { IS_PUBLIC } from '../decorators';
import { AUTH_SERVICE } from '@libs/core';

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

    const contextType = context.getType();

    let bearer: string, cookie: string;
    let request: any;

    if (contextType === 'http') {
      request = context.switchToHttp().getRequest() satisfies Request;
      bearer = request.headers.authorization;
      cookie = request.cookies['Authorization'];
    } else if (contextType === 'ws') {
      request = context.switchToWs().getClient()
        .request satisfies IncomingMessage;
      bearer = request.headers.authorization;
      cookie = request.cookies?.Authorization;
    }

    if (!bearer && !cookie) throw new UnauthorizedException();

    return this.authClientProxy
      .send<User>({ cmd: 'profile' }, { bearer, cookie })
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
