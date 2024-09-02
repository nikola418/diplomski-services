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
import { CreateFavoriteLocationDto } from './dto';
import {
  FavoriteLocationEntity,
  FavoriteLocationsService,
} from 'libs/data-access-locations/src';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';

@ApiTags('favorite locations')
@UseGuards(AccessGuard)
@Controller('favorite-locations')
export class FavoriteLocationsController {
  constructor(
    private readonly favoriteLocationsService: FavoriteLocationsService,
  ) {}

  @Put()
  @UseAbility(Actions.create, FavoriteLocationEntity)
  public create(
    @Body() createFavoriteLocationDto: CreateFavoriteLocationDto,
    @Param('userId') userId: string,
  ): Promise<FavoriteLocationEntity> {
    return this.favoriteLocationsService.create({
      location: { connect: { id: createFavoriteLocationDto.locationId } },
      user: { connect: { id: userId } },
    });
  }

  @Get()
  @UseAbility(Actions.read, FavoriteLocationEntity)
  public findAll(
    @Param('userId') userId: string,
  ): Promise<FavoriteLocationEntity[]> {
    return this.favoriteLocationsService.findAll({ userId });
  }

  @Get(':locationId')
  @UseAbility(Actions.read, FavoriteLocationEntity)
  public findOne(
    @Param('userId') userId: string,
    @Param('locationId') locationId: string,
  ): Promise<FavoriteLocationEntity> {
    return this.favoriteLocationsService.findOne({
      locationId_userId: { userId, locationId },
    });
  }

  @Delete(':locationId')
  @UseAbility(Actions.delete, FavoriteLocationEntity)
  public remove(
    @Param('userId') userId: string,
    @Param('locationId') locationId: string,
  ): Promise<FavoriteLocationEntity> {
    return this.favoriteLocationsService.remove({
      locationId_userId: { locationId, userId },
    });
  }
}
