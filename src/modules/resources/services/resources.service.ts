import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceEntity } from '../entities/resources.entity';
import { Repository } from 'typeorm';
import { CreateResourceDto } from '../dtos/create-resource.dto';
import { S3Service } from 'src/modules/aws/services/s3.service';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: Repository<ResourceEntity>,
    private readonly s3: S3Service,
  ) {}

  async createResource(
    images: Array<Express.Multer.File>,
    dto: CreateResourceDto,
  ): Promise<ResourceEntity> {
    const resource = this.resourceRepository.create(dto);

    const resourceSaved = await this.resourceRepository.save(resource);

    if (resourceSaved) {
      const fileNames: string[] = [];

      images.forEach(async (image) => {
        const ext = image.originalname.split('.').pop();
        const randomName = `image-${Date.now()}.${ext}`;
        console.log('randomName', randomName);

        await this.s3.upload({
          filename: randomName,
          file: image.buffer,
        });

        fileNames.push(randomName);

        this.resourceRepository.update(resourceSaved.id, { images: fileNames });
      });
    }

    return resourceSaved;
  }

  async findAllResources(): Promise<ResourceEntity[]> {
    return this.resourceRepository.findBy({ isActive: true });
  }

  async findResourceById(id: number): Promise<ResourceEntity> {
    return this.resourceRepository.findOneBy({ id });
  }

  async findResourceBetweenDates(
    startDate: Date,
    endDate: Date,
  ): Promise<ResourceEntity[]> {
    return this.resourceRepository
      .createQueryBuilder('resource')
      .where('resource.startDate >= :startDate', { startDate })
      .andWhere('resource.endDate <= :endDate', { endDate })
      .getMany();
  }
}
