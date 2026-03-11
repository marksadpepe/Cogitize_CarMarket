import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { FileService } from 'src/modules/file/file.service';

@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { entity, stream } = await this.fileService.getFile(id);
    const { mimeType, size } = entity;

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', size);
    stream.pipe(res);
  }
}
