import { AuthUser, IsPublic, PaginatedResult } from '@libs/common';
import {
  CreateUserDto,
  QueryUsersDto,
  UpdateUserDto,
  UserEntity,
  UsersService,
} from '@libs/data-access-users';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { $Enums, User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { UserHook } from './user.hook';

@ApiTags('users')
@Controller('users')
@UseGuards(AccessGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseAbility(Actions.create, UserEntity)
  @UseInterceptors(FileInterceptor('avatarImage'))
  public create(
    @Body() data: CreateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<UserEntity> {
    data.avatarImageKey = image?.id;

    return this.usersService.create({
      ...data,
      password: hashSync(data.password, genSaltSync()),
      roles: { set: [$Enums.Role.User] },
    });
  }

  @ApiQuery({ name: 'username', type: String, required: false })
  @Get()
  @UseAbility(Actions.read, UserEntity)
  public findAll(
    @AuthUser() user: User,
    @Query(ValidationPipe) queries?: QueryUsersDto,
  ): Promise<PaginatedResult<User>> {
    return this.usersService.paginate(queries, user);
  }

  @Get(':userId')
  @UseAbility(Actions.read, UserEntity)
  public findOne(@Param('userId') id: string): Promise<UserEntity> {
    return this.usersService.findOne({ id });
  }

  @UseAbility(Actions.update, UserEntity, UserHook)
  @ApiConsumes('multipart/form-data')
  @Patch(':userId')
  @UseInterceptors(FileInterceptor('avatarImage'))
  public update(
    @Param('userId') id: string,
    @Body() data: UpdateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<UserEntity> {
    data.avatarImageKey = image?.id;

    return this.usersService.update({ id }, data);
  }

  @UseAbility(Actions.delete, UserEntity, UserHook)
  @Delete(':userId')
  public remove(@Param('userId') id: string): Promise<UserEntity> {
    return this.usersService.remove({ id });
  }
}
