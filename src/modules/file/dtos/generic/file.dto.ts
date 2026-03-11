import { IsNumber, IsString, IsUUID } from 'class-validator';

import { File } from 'src/modules/file/interfaces/file.interface';

export class FileDto implements File {
  @IsUUID('4')
  id: string;

  @IsString()
  title: string;

  @IsString()
  url: string;

  @IsString()
  mimeType: string;

  @IsNumber()
  size: number;
}
