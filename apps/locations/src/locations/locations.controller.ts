import { AuthUser, PaginatedResult } from '@libs/common';
import { FilesService } from '@libs/data-access-files';
import {
  CreateLocationDto,
  LocationEntity,
  LocationsService,
  QueryLocationsDto,
  UpdateLocationDto,
} from '@libs/data-access-locations';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';

@ApiTags('locations')
@UseGuards(AccessGuard)
@Controller('locations')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly filesService: FilesService,
  ) {}

  private logger = new Logger(LocationsController.name);

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseAbility(Actions.create, LocationEntity)
  @UseInterceptors(FilesInterceptor('images'))
  public async create(
    @Body() dto: CreateLocationDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<LocationEntity> {
    if (images) {
      dto.imageKeys = (await this.filesService.uploadMany(images)).map((id) =>
        id.toString(),
      );
    }

    return this.locationsService.create(dto);
  }

  @Get()
  @UseAbility(Actions.read, LocationEntity)
  @UseInterceptors(ClassSerializerInterceptor)
  public async findAll(
    @AuthUser() user: User,
    @Query()
    filters: QueryLocationsDto,
  ): Promise<PaginatedResult<LocationEntity>> {
    const res = await this.locationsService.paginate(filters, user);
    res.data = plainToInstance(LocationEntity, res.data);
    return res;
  }

  @Get(':id')
  @UseAbility(Actions.read, LocationEntity)
  @UseInterceptors(ClassSerializerInterceptor)
  public async findOne(
    @Param('id') id: string,
    @AuthUser() user: User,
  ): Promise<LocationEntity> {
    return new LocationEntity(
      await this.locationsService.findOne(
        { id },
        {
          ...LocationsService.include,
          favoriteLocations: { where: { userId: user.id } },
        },
      ),
    );
  }

  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseAbility(Actions.update, LocationEntity)
  @UseInterceptors(FilesInterceptor('images'))
  public async update(
    @Param('id') id: string,
    @Body() data: UpdateLocationDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<LocationEntity> {
    if (images) {
      data.imageKeys = (await this.filesService.uploadMany(images)).map((id) =>
        id.toString(),
      );
    }
    return this.locationsService.update({ id }, data);
  }

  @Delete(':id')
  @UseAbility(Actions.delete, LocationEntity)
  public remove(@Param('id') id: string): Promise<LocationEntity> {
    return this.locationsService.remove({ id });
  }
}
