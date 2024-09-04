import { AuthUser, IsPublic, JWTPayload } from '@libs/common';
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
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { SignInDto } from './dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
  ): { token: string } {
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

    return { token: jwtPayload };
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
}
