import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ErrorManager } from 'src/utils/errorManager.util';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client = new S3Client({
    region: this.configServices.getOrThrow<string>('AWS_REGION'),
  });

  constructor(private readonly configServices: ConfigService) {}

  async upload({ filename, file }: { filename: string; file: Buffer }) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configServices.getOrThrow<string>('AWS_BUCKET_NAME'),
          Key: filename,
          Body: file,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  }

  async delete(filename: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configServices.getOrThrow<string>('AWS_BUCKET_NAME'),
        Key: filename,
      }),
    );
  }

  async getFile(filename: string) {
    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.configServices.getOrThrow<string>('AWS_BUCKET_NAME'),
          Key: filename,
        }),
      );

      const srt = response.Body.transformToString('base64');

      return srt;
    } catch (error) {
      throw new ErrorManager({
        type: error.code,
        message: error.message,
      });
    }
  }
}
