import { UsersService } from '@libs/data-access-users';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import {
  CreateUserDto,
  UpdateUserDto,
} from '../../../../libs/data-access-users/src/dto';
import { UserEntity } from '../../../../libs/data-access-users/src/entities';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.findOne({ id });
  }

  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('profileImage'))
  public update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<UserEntity> {
    data.profileImageKey = image?.id;

    return this.usersService.update({ id }, data);
  }

  @Delete(':id')
  public remove(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.remove({ id });
  }
}
