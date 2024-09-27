import { AuthUser, IsPublic } from '@libs/common';
import { PaginatedResult } from '@libs/core';
import { FilesService } from '@libs/data-access-files';
import {
  CreateUserDto,
  QueryUsersDto,
  UpdateUserDto,
  UserEntity,
  UserService,
} from '@libs/data-access-users';
import {
  Body,
  Controller,
  Delete,
  Get,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { UserHook } from './user.hook';

@ApiTags('users')
@Controller('users')
@UseGuards(AccessGuard)
export class UsersController {
  constructor(
    private readonly userService: UserService,
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
        .build({ fileIsRequired: false }),
    )
    image?: Express.Multer.File,
  ): Promise<UserEntity> {
    if (image) {
      dto.avatarImageKey = (
        await this.filesService.uploadOne(image)
      ).toString();
    }
    return this.userService.create(dto);
  }

  @ApiQuery({ name: 'username', type: String, required: false })
  @Get()
  @UseAbility(Actions.read, UserEntity)
  public findAll(
    @AuthUser() user: User,
    @Query(ValidationPipe) queries?: QueryUsersDto,
  ): Promise<PaginatedResult<User>> {
    return this.userService.paginate(user, queries);
  }

  @Get(':userId')
  @UseAbility(Actions.read, UserEntity)
  public findOne(@Param('userId') userId: string): Promise<UserEntity> {
    return this.userService.findOne({ id: userId });
  }

  @UseAbility(Actions.update, UserEntity, UserHook)
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
        .build({ fileIsRequired: false }),
    )
    image?: Express.Multer.File,
  ): Promise<UserEntity> {
    if (image) {
      dto.avatarImageKey = (
        await this.filesService.uploadOne(image)
      ).toString();
    }

    return this.userService.update({ id: userId }, dto);
  }

  @UseAbility(Actions.delete, UserEntity)
  @Delete(':userId')
  public remove(@Param('userId') userId: string): Promise<UserEntity> {
    return this.userService.remove({ id: userId });
  }
}
