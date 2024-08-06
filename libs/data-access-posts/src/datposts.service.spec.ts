import { Test, TestingModule } from '@nestjs/testing';
import { DataAccessPostsService } from './posts.service';

describe('DataAccessPostsService', () => {
  let service: DataAccessPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataAccessPostsService],
    }).compile();

    service = module.get<DataAccessPostsService>(DataAccessPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
