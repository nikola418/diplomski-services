import { UsersService } from '@libs/data-access-users';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { SignInDto } from './dto';
import { JWTPayload } from '@libs/common';
import { JwtService } from '@nestjs/jwt';
import { pick } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateSignIn(signInDto: SignInDto): Promise<User | null> {
    const user = await this.usersService.findOne({
      username: signInDto.username,
    });

    if (compareSync(signInDto.password, user.password)) return user;

    return null;
  }

  public getUser(id: string): Promise<User> {
    return this.usersService.findOne({ id });
  }

  public createToken(payload: JWTPayload): string {
    payload = pick(payload, ['id']);

    return this.jwtService.sign(payload);
  }
}
