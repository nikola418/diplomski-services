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
import { MessagePattern } from '@nestjs/microservices';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { SignInDto } from './dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@ApiTags('auth')
@UseGuards(JwtAuthGuard)
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
  ): UserEntity {
    const jwtPayload = this.jwtService.sign({
      id: user.id,
    } satisfies JWTPayload);

    res.cookie('Authentication', jwtPayload, {
      maxAge: this.configService.getOrThrow<number>('JWT_EXPIRES_IN') * 1000,
      path: '/',
      // domain: '192.168.1.108',
      sameSite: 'none',
      httpOnly: true,
      // secure: true,
    });

    return user;
  }

  @Get('profile')
  public me(@AuthUser() user: User): UserEntity {
    return user;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('sign-out')
  public signOut(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie('Authentication');
  }

  @UseFilters(HttpExceptionsRpcFilter)
  @MessagePattern('authenticate')
  public authenticate(@AuthUser() user: User): User {
    return user;
  }
}
