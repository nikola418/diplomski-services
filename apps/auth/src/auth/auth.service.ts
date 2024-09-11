import { JWTPayload } from '@libs/common';
import { UsersService } from '@libs/data-access-users';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { pick } from 'lodash';
import { SignInDto } from './dto';

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

    throw new UnauthorizedException();
  }

  public getUser(id: string): Promise<User> {
    return this.usersService.findOne({ id });
  }

  public createToken(payload: JWTPayload): string {
    payload = pick(payload, ['id']);

    return this.jwtService.sign(payload);
  }
}
