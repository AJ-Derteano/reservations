import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResourcesService } from '../services/resources.service';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { CreateResourceDto } from '../dtos/create-resource.dto';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/consts/userRoles.const';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourceServices: ResourcesService) {}

  @Get()
  async getAllResources() {
    return this.resourceServices.findAllResources();
  }

  @Get(':id')
  async getResourceById(@Param('id') id: number) {
    return this.resourceServices.findResourceById(id);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async createResource(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() dto: CreateResourceDto,
  ) {
    return this.resourceServices.createResource(images, dto);
  }
}
