import { PostsService } from '@libs/data-access-posts';
import {
  Body,
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
  public findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.findOne({ id });
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
