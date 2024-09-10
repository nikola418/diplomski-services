import { USERS_SERVICE } from '@libs/common';
import {
  CreateFavoriteLocationDto,
  FavoriteLocationEntity,
} from '@libs/data-access-users';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { firstValueFrom } from 'rxjs';

@ApiTags('favorite locations')
@UseGuards(AccessGuard)
@Controller('favorite-locations')
export class FavoriteLocationsController {
  constructor(@Inject(USERS_SERVICE) private readonly client: ClientRMQ) {}

  @Put()
  @UseAbility(Actions.create, FavoriteLocationEntity)
  public create(
    @Body() createFavoriteLocationDto: CreateFavoriteLocationDto,
    @Param('userId') userId: string,
  ): Promise<FavoriteLocationEntity> {
    return firstValueFrom(
      this.client.send(
        { scope: 'favorite-locations', cmd: 'create' },
        {
          location: { connect: { id: createFavoriteLocationDto.locationId } },
          user: { connect: { id: userId } },
        },
      ),
    );
  }

  @Get()
  @UseAbility(Actions.read, FavoriteLocationEntity)
  public findAll(
    @Param('userId') userId: string,
  ): Promise<FavoriteLocationEntity[]> {
    return firstValueFrom(
      this.client.send(
        { scope: 'favorite-locations', cmd: 'findAll' },
        { userId },
      ),
    );
  }

  @Get(':locationId')
  @UseAbility(Actions.read, FavoriteLocationEntity)
  public findOne(
    @Param('userId') userId: string,
    @Param('locationId') locationId: string,
  ): Promise<FavoriteLocationEntity> {
    return firstValueFrom(
      this.client.send(
        { scope: 'favorite-locations', cmd: 'findOne' },
        {
          locationId_userId: { userId, locationId },
        },
      ),
    );
  }

  @Delete(':locationId')
  @UseAbility(Actions.delete, FavoriteLocationEntity)
  public remove(
    @Param('userId') userId: string,
    @Param('locationId') locationId: string,
  ): Promise<FavoriteLocationEntity> {
    return firstValueFrom(
      this.client.send(
        { scope: 'favorite-locations', cmd: 'remove' },
        {
          locationId_userId: { locationId, userId },
        },
      ),
    );
  }
}
