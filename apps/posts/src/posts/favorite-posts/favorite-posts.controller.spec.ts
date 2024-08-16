import { Test, TestingModule } from '@nestjs/testing';
import { FavoritePostsController } from './favorite-posts.controller';

describe('FavoritePostsController', () => {
  let controller: FavoritePostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritePostsController],
    }).compile();

    controller = module.get<FavoritePostsController>(FavoritePostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
