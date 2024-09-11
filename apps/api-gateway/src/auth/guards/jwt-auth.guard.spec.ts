import { TestBed } from '@automock/jest';
import { JwtAuthGuard } from './jwt-auth.guard';

describe(JwtAuthGuard.name, () => {
  let jwtAuthGuard: JwtAuthGuard;
  beforeAll(() => {
    const { unit } = TestBed.create(JwtAuthGuard).compile();
    jwtAuthGuard = unit;
  });

  it('should be defined', () => {
    expect(jwtAuthGuard).toBeTruthy();
  });
});
