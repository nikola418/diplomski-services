import { FilesService } from '@libs/data-access-files';
import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<StreamableFile> {
    const [file, fileStream] = await this.filesService.findOne(id);
    return new StreamableFile(fileStream, { type: file.contentType });
  }
}
