import { AuthUser } from '@libs/common';
import { PostsService } from '@libs/data-access-posts';
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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostEntity } from './entity';

@ApiTags('posts')
@UseGuards(AccessGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  private logger = new Logger(PostsController.name);

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseAbility(Actions.create, PostEntity)
  @UseInterceptors(FilesInterceptor('images'))
  public async create(
    @Body() data: CreatePostDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<PostEntity> {
    data.imageKeys = images?.map((image) => image.id);

    return this.postsService.create(data);
  }

  @Get()
  @UseAbility(Actions.read, PostEntity)
  @UseInterceptors(ClassSerializerInterceptor)
  public async findAll(@AuthUser() user: User): Promise<PostEntity[]> {
    return plainToInstance(
      PostEntity,
      await this.postsService.findAll(
        {},
        {
          ...PostsService.include,
          favoritePosts: { where: { userId: user.id } },
        },
      ),
    );
  }

  @Get(':id')
  @UseAbility(Actions.read, PostEntity)
  @UseInterceptors(ClassSerializerInterceptor)
  public async findOne(
    @Param('id') id: string,
    @AuthUser() user: User,
  ): Promise<PostEntity> {
    return new PostEntity(
      await this.postsService.findOne(
        { id },
        {
          ...PostsService.include,
          favoritePosts: { where: { userId: user.id } },
        },
      ),
    );
  }

  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseAbility(Actions.update, PostEntity)
  @UseInterceptors(FilesInterceptor('images'))
  public update(
    @Param('id') id: string,
    @Body() data: UpdatePostDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<PostEntity> {
    data.imageKeys = images?.map((image) => image.id);

    return this.postsService.update({ id }, data);
  }

  @Delete(':id')
  @UseAbility(Actions.delete, PostEntity)
  public remove(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.remove({ id });
  }
}
