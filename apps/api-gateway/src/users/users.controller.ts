import {
  AuthUser,
  IsPublic,
  PaginatedResult,
  USERS_SERVICE,
} from '@libs/common';
import { FilesService } from '@libs/data-access-files';
import {
  CreateUserDto,
  QueryUsersDto,
  UpdateUserDto,
  UserEntity,
} from '@libs/data-access-users';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthUserHook } from './favorite-locations/user.hook';

@ApiTags('users')
@Controller('users')
@UseGuards(AccessGuard)
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE) private readonly client: ClientProxy,
    private readonly filesService: FilesService,
  ) {}
  private readonly logger = new Logger(UsersController.name);

  @IsPublic()
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseAbility(Actions.create, UserEntity)
  @UseInterceptors(FileInterceptor('avatarImage'))
  public async create(
    @Body() dto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 1000 * 1000 })
        .addFileTypeValidator({ fileType: 'image' })
        .build(),
    )
    image?: Express.Multer.File,
  ): Promise<Observable<UserEntity>> {
    if (image) {
      dto.avatarImageKey = (
        await this.filesService.uploadOne(image)
      ).toString();
    }
    return this.client.send<UserEntity>({ cmd: 'create' }, dto);
  }

  @ApiQuery({ name: 'username', type: String, required: false })
  @Get()
  @UseAbility(Actions.read, UserEntity)
  public findAll(
    @AuthUser() user: User,
    @Query(ValidationPipe) queries?: QueryUsersDto,
  ): Promise<PaginatedResult<User>> {
    return firstValueFrom(
      this.client.send({ cmd: 'paginate' }, { queries, user }),
    );
  }

  @Get(':userId')
  @UseAbility(Actions.read, UserEntity)
  public findOne(@Param('userId') userId: string): Promise<UserEntity> {
    return firstValueFrom(this.client.send({ cmd: 'findOne' }, { userId }));
  }

  @UseAbility(Actions.update, UserEntity, AuthUserHook)
  @ApiConsumes('multipart/form-data')
  @Patch(':userId')
  @UseInterceptors(FileInterceptor('avatarImage'))
  public async update(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 1000 * 1000 })
        .addFileTypeValidator({ fileType: 'image' })
        .build(),
    )
    image?: Express.Multer.File,
  ): Promise<UserEntity> {
    if (image) {
      dto.avatarImageKey = (
        await this.filesService.uploadOne(image)
      ).toString();
    }
    return firstValueFrom(this.client.send({ cmd: 'update' }, { userId, dto }));
  }

  @UseAbility(Actions.delete, UserEntity)
  @Delete(':userId')
  public remove(@Param('userId') userId: string): Promise<UserEntity> {
    return firstValueFrom(this.client.send({ cmd: 'remove' }, { userId }));
  }
}
