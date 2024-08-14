import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { ConfigType } from '@nestjs/config';
import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import registerAuthConfig from '../config/register-auth.config';
import { AuthService } from '../services';
import { JwtStrategy } from './jwt.strategy';

describe(JwtStrategy.name, () => {
  let jwtStrategy: JwtStrategy;
  let authService: jest.Mocked<AuthService>;

  const authConfig = createMock<ConfigType<typeof registerAuthConfig>>({
    jwt: {
      secret: randomBytes(64).toString(),
      signOptions: { expiresIn: 3600 },
    },
  });

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(JwtStrategy)
      .mock(registerAuthConfig.KEY)
      .using(authConfig)
      .compile();
    jwtStrategy = unit;
    authService = unitRef.get(AuthService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeTruthy();
  });

  describe('when validate is called', () => {
    let user: User;
    describe('and payload is valid', () => {
      beforeAll(() => {
        user = createMock();
        authService.getUser.mockResolvedValue(user);
      });
      it('should return the user', () => {
        const res = jwtStrategy.validate(user);
        expect(res).resolves.toBe(user);
      });
    });

    describe('and invalid payload is passed', () => {
      it('should throw error', () => {
        expect(() => jwtStrategy.validate(null)).toThrow();
      });
    });
  });
});
