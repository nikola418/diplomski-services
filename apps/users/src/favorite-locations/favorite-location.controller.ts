import {
  FavoriteLocationEntity,
  FavoriteLocationService,
  UserEntity,
} from '@libs/data-access-users';
import { Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { AuthUserHook } from './user.hook';

@ApiTags('favorite locations')
@UseGuards(AccessGuard)
@Controller('favorite-locations')
export class FavoriteLocationController {
  constructor(
    private readonly favoriteLocationService: FavoriteLocationService,
  ) {}

  @Put(':locationId')
  @UseAbility(Actions.update, UserEntity, AuthUserHook)
  @UseAbility(Actions.create, FavoriteLocationEntity)
  public create(
    @Param('userId') userId: string,
    @Param('locationId') locationId: string,
  ): Promise<FavoriteLocationEntity> {
    return this.favoriteLocationService.upsert(userId, locationId);
  }

  @Get()
  @UseAbility(Actions.read, FavoriteLocationEntity)
  public findAll(
    @Param('userId') userId: string,
  ): Promise<FavoriteLocationEntity[]> {
    return this.favoriteLocationService.findAll({ userId });
  }

  @Get(':locationId')
  @UseAbility(Actions.read, FavoriteLocationEntity)
  public findOne(
    @Param('userId') userId: string,
    @Param('locationId') locationId: string,
  ): Promise<FavoriteLocationEntity> {
    return this.favoriteLocationService.findOne({
      locationId_userId: { userId, locationId },
    });
  }

  @Delete(':locationId')
  @UseAbility(Actions.delete, FavoriteLocationEntity)
  public remove(
    @Param('userId') userId: string,
    @Param('locationId') locationId: string,
  ): Promise<FavoriteLocationEntity> {
    return this.favoriteLocationService.remove({
      locationId_userId: { locationId, userId },
    });
  }
}
