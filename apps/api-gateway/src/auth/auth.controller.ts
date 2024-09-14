import { AUTH_SERVICE, AuthUser, IsPublic, JwtAuthGuard } from '@libs/common';
import { UserEntity } from '@libs/data-access-users';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';
import { SignInDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AUTH_SERVICE) private readonly client: ClientProxy,
  ) {}
  private readonly logger = new Logger(AuthController.name);

  @IsPublic()
  @Post('sign-in')
  public signIn(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Observable<{ token: string }> {
    return this.client.send<{ token: string }>({ cmd: 'sign-in' }, data).pipe(
      tap((payload) => {
        res.cookie('Authorization', payload.token, {
          maxAge:
            this.configService.getOrThrow<number>('JWT_EXPIRES_IN') * 1000,
          path: '/',
          // domain: '192.168.1.108',
          sameSite: 'lax',
          httpOnly: true,
          // secure: true,
        });
      }),
    );
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
