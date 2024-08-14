import { TestBed } from '@automock/jest';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { of } from 'rxjs';
import { AUTH_SERVICE } from '../constants';
import { JwtAuthGuard } from './jwt-auth.guard';

describe(JwtAuthGuard.name, () => {
  let jwtAuthGuard: JwtAuthGuard;
  let authClientProxy: jest.Mocked<ClientProxy>;
  let reflector: jest.Mocked<Reflector>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(JwtAuthGuard).compile();
    jwtAuthGuard = unit;
    authClientProxy = unitRef.get<ClientProxy>(AUTH_SERVICE);
    reflector = unitRef.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(jwtAuthGuard).toBeTruthy();
  });

  describe('when canActivate is called', () => {
    let executionContext: DeepMocked<ExecutionContext>;

    describe('and IS_PUBLIC is set', () => {
      beforeAll(() => {
        executionContext = createMock({});
        reflector.getAllAndOverride.mockReturnValue(true);
      });
      it('should return true', () => {
        const res = jwtAuthGuard.canActivate(executionContext);
        expect(res).toBe(true);
      });
    });

    describe('and IS_PUBLIC is not set', () => {
      beforeAll(() => {
        reflector.getAllAndOverride.mockReturnValue(false);
      });
      describe('and Authentication header/cookie is not present', () => {
        beforeAll(() => {
          executionContext = createMock<ExecutionContext>({
            switchToHttp: () => ({
              getRequest: () =>
                createMock({
                  cookies: {},
                  headers: {},
                }),
            }),
          });
        });
        it('should throw UnauthorizedException', async () => {
          expect(() => jwtAuthGuard.canActivate(executionContext)).toThrow(
            UnauthorizedException,
          );
        });
      });

      describe('and Authentication cookie is present', () => {
        let jwt: string;
        let user: User;
        beforeAll(() => {
          jwt = 'asdfsaf';
          user = createMock<User>();
          authClientProxy.send.mockImplementation(() => of(user));

          executionContext = createMock<ExecutionContext>({
            switchToHttp: () => ({
              getRequest: () =>
                createMock({
                  cookies: { Authentication: jwt },
                }),
            }),
          });
        });
        describe('and authenticate resolves the user', () => {
          it('asd', () => {
            console.log(jwtAuthGuard.canActivate(executionContext));
          });
        });
      });
    });
  });
});
