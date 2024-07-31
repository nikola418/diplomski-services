import { Test, TestingModule } from '@nestjs/testing';
import { DataAccessUsersService } from './data-access-users.service';

describe('DataAccessUsersService', () => {
  let service: DataAccessUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataAccessUsersService],
    }).compile();

    service = module.get<DataAccessUsersService>(DataAccessUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
