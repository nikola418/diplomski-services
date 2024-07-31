import { UsersService } from '@app/data-access-users';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public create(data: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(data);
  }

  @Get()
  public findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.findOne({ id });
  }

  @Patch('id')
  public update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update({ id }, data);
  }

  @Delete(':id')
  public remove(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.remove({ id });
  }
}
