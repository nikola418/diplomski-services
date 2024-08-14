import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateFavoritePostDto } from './dto';
import { FavoritePostsService } from '@libs/data-access-posts';
import { FavoritePostEntity } from './entities';

@ApiTags('favorite posts')
@Controller('favorite-posts')
export class FavoritePostsController {
  constructor(private readonly favoritePostsService: FavoritePostsService) {}

  @Put()
  public create(
    @Body() createFavoritePostDto: CreateFavoritePostDto,
    @Param('userId') userId: string,
  ): Promise<FavoritePostEntity> {
    return this.favoritePostsService.create({
      post: { connect: { id: createFavoritePostDto.postId } },
      user: { connect: { id: userId } },
    });
  }

  @Get()
  public findAll(
    @Param('userId') userId: string,
  ): Promise<FavoritePostEntity[]> {
    return this.favoritePostsService.findAll({ userId });
  }

  @Get(':postId')
  public findOne(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<FavoritePostEntity> {
    return this.favoritePostsService.findOne({
      postId_userId: { userId, postId },
    });
  }

  @Delete(':postId')
  public remove(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<FavoritePostEntity> {
    return this.favoritePostsService.remove({
      postId_userId: { postId, userId },
    });
  }
}
