import { Controller, Param, Post } from '@nestjs/common';
import { S3Service } from '../services/s3.service';

@Controller('file')
export class S3Controller {
  constructor(private readonly s3Services: S3Service) {}

  @Post(':filename')
  async getFile(@Param('filename') filename: string) {
    return await this.s3Services.getFile(filename);
  }
}
