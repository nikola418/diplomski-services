import {
  CreateFavoriteLocationDto,
  FavoriteLocationEntity,
  FavoriteLocationsService,
} from '@libs/data-access-users';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class FavoriteLocationsController {
  constructor(
    private readonly favoriteLocationsService: FavoriteLocationsService,
  ) {}

  @MessagePattern({ scope: 'favorite-locations', cmd: 'create' })
  public create(
    @Payload('userId') userId: string,
    @Payload('data') data: CreateFavoriteLocationDto,
  ): Promise<FavoriteLocationEntity> {
    return this.favoriteLocationsService.create({
      location: { connect: { id: data.locationId } },
      user: { connect: { id: userId } },
    });
  }

  @MessagePattern({ scope: 'favorite-locations', cmd: 'findAll' })
  public findAll(
    @Payload('userId') userId: string,
  ): Promise<FavoriteLocationEntity[]> {
    return this.favoriteLocationsService.findAll({ userId });
  }

  @MessagePattern({ scope: 'favorite-locations', cmd: 'findOne' })
  public findOne(
    @Payload('userId') userId: string,
    @Payload('locationId') locationId: string,
  ): Promise<FavoriteLocationEntity> {
    return this.favoriteLocationsService.findOne({
      locationId_userId: { userId, locationId },
    });
  }

  @MessagePattern({ scope: 'favorite-locations', cmd: 'remove' })
  public remove(
    @Payload('userId') userId: string,
    @Payload('locationId') locationId: string,
  ): Promise<FavoriteLocationEntity> {
    return this.favoriteLocationsService.remove({
      locationId_userId: { locationId, userId },
    });
  }
}
