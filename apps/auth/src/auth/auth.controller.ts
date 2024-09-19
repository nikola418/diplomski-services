import { AuthUser, IsPublic } from '@libs/common';
import { UserEntity } from '@libs/data-access-users';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { LocalAuthGuard } from './guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  private readonly logger = new Logger(AuthController.name);

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  public signIn(
    @AuthUser() { id }: User,
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): { token: string } {
    const token = this.authService.createToken({ id });
    res.cookie('Authorization', token, {
      maxAge: this.configService.getOrThrow<number>('JWT_EXPIRES_IN') * 1000,
      path: '/',
      // domain: '192.168.1.108',
      sameSite: 'lax',
      httpOnly: true,
      // secure: true,
    });

    return { token };
  }

  @Get('profile')
  public me(@AuthUser() user: User): UserEntity {
    return user;
  }

  @Delete('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  public signOut(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie('Authorization');
  }
}
