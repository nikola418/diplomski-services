import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { User } from '@prisma/client';
import { AuthService } from '../services';
import { LocalStrategy } from './local.strategy';

describe(LocalStrategy.name, () => {
  let localStrategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(LocalStrategy).compile();
    localStrategy = unit;
    authService = unitRef.get(AuthService);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeTruthy();
  });

  describe('when validate is called', () => {
    let username: 'string';
    let password: 'string';
    describe('and user is found wit matching password', () => {
      let user: User;
      beforeAll(() => {
        user = createMock();
        authService.validateUser.mockResolvedValue(user);
      });
      it('should return the user', () => {
        const res = localStrategy.validate(username, password);
        expect(authService.validateUser).toHaveBeenCalledWith({
          username,
          password,
        });
        expect(res).resolves.toBe(user);
      });
    });

    describe('and password does not match', () => {
      beforeAll(() => {
        authService.validateUser.mockReturnValue(null);
      });
      it('should return null', () => {
        const res = localStrategy.validate(username, password);
        expect(res).resolves.toBeNull();
      });
    });

    describe('and user is not found', () => {
      beforeAll(() => {
        authService.validateUser.mockImplementation(() => {
          throw new Error();
        });
      });
      it('should throw error', () => {
        const res = localStrategy.validate(username, password);
        expect(res).rejects.toBeInstanceOf(Error);
        expect(authService.validateUser).toHaveBeenCalledWith({});
      });
    });
  });
});
