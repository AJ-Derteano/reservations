import { Module } from '@nestjs/common';
import { ResourcesService } from './services/resources.service';
import { ResourcesController } from './controllers/resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceEntity } from './entities/resources.entity';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule, TypeOrmModule.forFeature([ResourceEntity])],
  providers: [ResourcesService],
  controllers: [ResourcesController],
  exports: [ResourcesService],
})
export class ResourcesModule {}
