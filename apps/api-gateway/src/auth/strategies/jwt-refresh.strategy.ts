import { UsersService } from '@libs/data-access-users';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtRefreshSecret'),
    });
  }

  async validate(payload: any) {
    const authUser = await this.userService.findOne(payload.sub);
    if (!authUser) {
      throw new UnauthorizedException();
    }
    return {
      attributes: authUser,
      refreshTokenExpiresAt: new Date(payload.exp * 1000),
    };
  }
}
