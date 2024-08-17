import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { IStrategyOptions, Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(<IStrategyOptions>{
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  public async validate(username: string, password: string): Promise<User> {
    return this.authService.validateLogin({ username, password });
  }
}