import { USERS_SERVICE } from '@libs/common';
import {
  CreateFavoriteLocationDto,
  FavoriteLocationEntity,
  UserEntity,
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
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthUserHook } from './user.hook';

@ApiTags('favorite locations')
@UseGuards(AccessGuard)
@Controller('favorite-locations')
export class FavoriteLocationsController {
  constructor(@Inject(USERS_SERVICE) private readonly client: ClientProxy) {}

  @Put()
  @UseAbility(Actions.update, UserEntity, AuthUserHook)
  @UseAbility(Actions.create, FavoriteLocationEntity)
  public create(
    @Body() data: CreateFavoriteLocationDto,
    @Param('userId') userId: string,
  ): Observable<FavoriteLocationEntity> {
    return this.client.send(
      { scope: 'favorite-locations', cmd: 'create' },
      {
        data,
        userId,
      },
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
          userId,
          locationId,
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
          locationId,
          userId,
        },
      ),
    );
  }
}
