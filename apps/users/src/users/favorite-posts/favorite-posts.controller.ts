import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateFavoritePostDto } from './dto';
import {
  FavoritePostEntity,
  FavoritePostsService,
} from '@libs/data-access-posts';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';

@ApiTags('favorite posts')
@UseGuards(AccessGuard)
@Controller('favorite-posts')
export class FavoritePostsController {
  constructor(private readonly favoritePostsService: FavoritePostsService) {}

  @Put()
  @UseAbility(Actions.create, FavoritePostEntity)
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
  @UseAbility(Actions.read, FavoritePostEntity)
  public findAll(
    @Param('userId') userId: string,
  ): Promise<FavoritePostEntity[]> {
    return this.favoritePostsService.findAll({ userId });
  }

  @Get(':postId')
  @UseAbility(Actions.read, FavoritePostEntity)
  public findOne(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<FavoritePostEntity> {
    return this.favoritePostsService.findOne({
      postId_userId: { userId, postId },
    });
  }

  @Delete(':postId')
  @UseAbility(Actions.delete, FavoritePostEntity)
  public remove(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<FavoritePostEntity> {
    return this.favoritePostsService.remove({
      postId_userId: { postId, userId },
    });
  }
}
