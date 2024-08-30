import {
  AuthUser,
  HttpExceptionsRpcFilter,
  IsPublic,
  JWTPayload,
} from '@libs/common';
import { UserEntity } from '@libs/data-access-users';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}
  private readonly logger = new Logger(AuthController.name);

  @ApiBody({ type: SignInDto })
  @IsPublic()
  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  public signIn(
    @Res({ passthrough: true }) res: Response,
    @AuthUser() user: User,
  ): UserEntity {
    const jwtPayload = this.jwtService.sign({
      id: user.id,
    } satisfies JWTPayload);

    res.cookie('Authorization', jwtPayload, {
      maxAge: this.configService.getOrThrow<number>('JWT_EXPIRES_IN') * 1000,
      path: '/',
      // domain: '192.168.1.108',
      sameSite: 'lax',
      httpOnly: true,
      // secure: true,
    });

    return user;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  public me(@AuthUser() user: User): UserEntity {
    return user;
  }

  @Delete('sign-out')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public signOut(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie('Authorization');
  }

  @UseFilters(HttpExceptionsRpcFilter)
  @MessagePattern({ cmd: 'authorize' })
  public authorize(
    @Payload() data: { bearer: string; cookie: string },
  ): Promise<User> {
    const { id } = this.jwtService.verify<UserEntity>(
      data.bearer.substring(7) || data.cookie,
    );

    return this.authService.getUser(id);
  }
}
