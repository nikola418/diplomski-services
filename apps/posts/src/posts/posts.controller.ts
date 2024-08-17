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
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { CreatePostDto, UpdatePostDto } from './dto';
import { PostEntity } from './entity';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  private logger = new Logger(PostsController.name);

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  public async create(
    @Body() data: CreatePostDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<PostEntity> {
    data.imageKeys = images?.map((image) => image.id);

    return this.postsService.create(data);
  }

  @Get()
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

  @Patch('id')
  public update(
    @Param('id') id: string,
    @Body() data: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.update({ id }, data);
  }

  @Delete(':id')
  public remove(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.remove({ id });
  }
}
