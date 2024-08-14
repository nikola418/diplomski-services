import { AuthUser, HttpExceptionsRpcFilter, IsPublic } from '@libs/common';
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
  ): User {
    res.cookie('Authentication', this.jwtService.sign({ ...user }), {
      maxAge: this.configService.getOrThrow<number>('JWT_EXPIRES_IN') * 1000,
      domain: 'localhost',
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
    });

    return user;
  }

  @Get('profile')
  public me(@AuthUser() user: User): User {
    return user;
  }

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
