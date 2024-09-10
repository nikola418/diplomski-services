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
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { firstValueFrom } from 'rxjs';

@ApiTags('users')
@Controller('users')
@UseGuards(AccessGuard)
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE) private readonly client: ClientRMQ,
    private readonly filesService: FilesService,
  ) {}

  @IsPublic()
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseAbility(Actions.create, UserEntity)
  @UseInterceptors(FileInterceptor('avatarImage'))
  public async create(
    @Body() data: CreateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<UserEntity> {
    if (image) {
      data.avatarImageKey = (
        await this.filesService.uploadOne(image)
      ).toString();
    }

    return firstValueFrom(
      this.client.send(
        { cmd: 'create' },
        {
          ...data,
          password: hashSync(data.password, genSaltSync()),
          roles: { set: [$Enums.Role.User] },
        },
      ),
    );
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
  public findOne(@Param('userId') id: string): Promise<UserEntity> {
    return firstValueFrom(this.client.send({ cmd: 'findOne' }, { id }));
  }

  @UseAbility(Actions.update, UserEntity)
  @ApiConsumes('multipart/form-data')
  @Patch(':userId')
  @UseInterceptors(FileInterceptor('avatarImage'))
  public async update(
    @Param('userId') id: string,
    @Body() data: UpdateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<UserEntity> {
    if (image) {
      data.avatarImageKey = (
        await this.filesService.uploadOne(image)
      ).toString();
    }

    return firstValueFrom(
      this.client.send({ cmd: 'update' }, { as: { id }, data }),
    );
  }

  @UseAbility(Actions.delete, UserEntity)
  @Delete(':userId')
  public remove(@Param('userId') id: string): Promise<UserEntity> {
    return firstValueFrom(this.client.send({ cmd: 'remove' }, { id }));
  }
}
