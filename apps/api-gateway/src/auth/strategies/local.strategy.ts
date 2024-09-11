import { AUTH_SERVICE } from '@libs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { IStrategyOptions, Strategy } from 'passport-local';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly client: ClientRMQ,
  ) {
    super(<IStrategyOptions>{
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  public async validate(username: string, password: string): Promise<User> {
    return firstValueFrom(
      this.client.send<User>('validate', { username, password }),
    );
  }
}
