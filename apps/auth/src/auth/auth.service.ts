import { UsersService } from '@libs/data-access-users';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { SignInDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  public async validateLogin(signInDto: SignInDto): Promise<User | null> {
    const user = await this.usersService.findOne({
      username: signInDto.username,
    });

    if (compareSync(signInDto.password, user.password)) return user;

    return null;
  }
}
