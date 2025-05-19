import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { RoleGuard } from 'src/modules/auth/guards/role.guard';
import { ReservationService } from '../services/reservation.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { RequestExpress } from 'src/modules/auth/interfaces/requesExpress';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/consts/userRoles.const';
import { Pagination } from 'src/dtos/Pagination';

@Controller('reservation')
@UseGuards(JwtGuard, RoleGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post('create')
  @Roles(UserRoles.CLIENT)
  async createReservation(
    @Req() req: RequestExpress,
    @Body() dto: CreateReservationDto,
  ) {
    const username = req.user.username;
    return this.reservationService.create(username, dto);
  }

  @Get('me')
  @Roles(UserRoles.CLIENT)
  async getMyReservations(@Req() req: RequestExpress) {
    const username = req.user.username;
    return this.reservationService.getMyReservations(username);
  }

  @Get()
  @Roles(UserRoles.ADMIN)
  async getAllReservations(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortOrder') sortOrder: Pagination['sortOrder'] = 'DESC',
  ) {
    return this.reservationService.getAllReservations({
      page,
      limit,
      sortBy: 'createdAt',
      sortOrder,
    });
  }
}
