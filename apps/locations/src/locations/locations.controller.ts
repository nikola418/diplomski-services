import { AuthUser, PaginatedResult } from '@libs/common';
import {
  LocationEntity,
  LocationsService,
  QueryLocationsDto,
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
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { CreateLocationDto, UpdateLocationDto } from './dto';
import { FilesService } from '@libs/data-access-files';

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
    @Body() data: CreateLocationDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<LocationEntity> {
    const ids = await this.filesService.uploadMany(images);

    data.imageKeys = ids.map((id) => id.toString());

    return this.locationsService.create(data);
  }

  @Get()
  @UseAbility(Actions.read, LocationEntity)
  @UseInterceptors(ClassSerializerInterceptor)
  public async findAll(
    @AuthUser() user: User,
    @Query(ValidationPipe)
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
  public update(
    @Param('id') id: string,
    @Body() data: UpdateLocationDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<LocationEntity> {
    data.imageKeys = images?.map((image) => image.id);

    return this.locationsService.update({ id }, data);
  }

  @Delete(':id')
  @UseAbility(Actions.delete, LocationEntity)
  public remove(@Param('id') id: string): Promise<LocationEntity> {
    return this.locationsService.remove({ id });
  }
}
