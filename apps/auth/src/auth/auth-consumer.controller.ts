import { UserEntity } from '@libs/data-access-users';
import { Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';

@Controller()
export class AuthConsumerController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @MessagePattern({ cmd: 'profile' })
  public profile(
    @Payload() data: { bearer: string; cookie: string },
  ): Promise<User> {
    const { id } = this.jwtService.verify<UserEntity>(
      data.bearer?.substring(7) || data.cookie,
    );
    return this.authService.getUser(id);
  }
}
