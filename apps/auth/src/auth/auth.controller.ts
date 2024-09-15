import { UserEntity } from '@libs/data-access-users';
import { Controller, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';

@Controller()
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}
  private readonly logger = new Logger(AuthController.name);

  @MessagePattern({ cmd: 'sign-in' })
  public async signIn(@Payload() data: SignInDto): Promise<{ token: string }> {
    const user = await this.authService.validateSignIn(data);
    const token = this.authService.createToken(user);

    return { token };
  }

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
