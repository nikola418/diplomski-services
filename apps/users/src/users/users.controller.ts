import { IsPublic, JwtAuthGuard } from '@libs/common';
import {
  CreateUserDto,
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { UserHook } from './user.hook';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('profileImage'))
  public create(
    @Body() data: CreateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<UserEntity> {
    data.profileImageKey = image?.id;

    return this.usersService.create({ ...data });
  }

  @Get()
  public findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  public findOne(@Param('userId') id: string): Promise<UserEntity> {
    return this.usersService.findOne({ id });
  }

  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, UserEntity, UserHook)
  @ApiConsumes('multipart/form-data')
  @Patch(':userId')
  @UseInterceptors(FileInterceptor('profileImage'))
  public update(
    @Param('userId') id: string,
    @Body() data: UpdateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<UserEntity> {
    data.profileImageKey = image?.id;

    return this.usersService.update({ id }, data);
  }

  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, UserEntity, UserHook)
  @Delete(':userId')
  public remove(@Param('userId') id: string): Promise<UserEntity> {
    return this.usersService.remove({ id });
  }
}
