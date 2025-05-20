import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationEntity } from '../entities/reservation.entity';
import { Repository } from 'typeorm';
import { ResourcesService } from 'src/modules/resources/services/resources.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { durationTimes } from 'src/consts/durationTimes';
import { UserService } from 'src/modules/users/services/user.service';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { ErrorManager } from 'src/utils/errorManager.util';
import * as dayjs from 'dayjs';
import { Pagination } from 'src/dtos/Pagination';
import { instanceToPlain } from 'class-transformer';
import { NotificationService } from 'src/modules/notifications/services/notification.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    private readonly resourceService: ResourcesService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    username: string,
    dto: CreateReservationDto,
  ): Promise<{ id: number }> {
    try {
      const {
        resourceId,
        reservationType,
        duration,
        quantity,
        startTime,
        price,
      } = dto;
      const durationTime = durationTimes[reservationType];
      const startTimeUTC = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss');
      const endTimeUTC = dayjs(startTimeUTC)
        .add(duration * durationTime, 'milliseconds')
        .format('YYYY-MM-DD HH:mm:ss');

      const resource = await this.resourceService.findResourceById(resourceId);

      if (!resource) {
        new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Resource not found',
        });
      }

      // Check if the resource is available
      if (!resource.isAvailable) {
        new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Resource is not available',
        });
      }

      const occupiedResources = await this.reservationRepository
        .createQueryBuilder('reservation')
        .where('reservation.resource = :resourceId', { resourceId })
        .andWhere('reservation.status != :status', { status: 'cancelled' })
        .andWhere('reservation.startTime < :endTimeUTC', {
          endTimeUTC,
        })
        .andWhere('reservation.endTime > :startTimeUTC', {
          startTimeUTC,
        })
        .getCount();

      const availableResources = resource.quantity - occupiedResources;

      if (availableResources < quantity) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Resource is already reserved for the selected time',
        });
      }

      const user = (await this.userService.findByKey({
        key: 'username',
        value: username,
        one: true,
      })) as UserEntity;

      const reservation = new ReservationEntity();
      reservation.user = user;
      reservation.resource = resource;
      reservation.date = new Date();
      reservation.startTime = new Date(startTimeUTC);
      reservation.endTime = new Date(endTimeUTC);
      reservation.price = price;
      reservation.reservationType = reservationType;
      reservation.duration = duration;
      reservation.quantity = quantity;
      reservation.status = 'pending';
      reservation.paymentStatus = 'pending';

      const savedReservation =
        await this.reservationRepository.save(reservation);

      const emailTemplate =
        this.notificationService.getReservationPendingTemplate({
          names: user.username,
          reservationName: resource.name,
          reservationType: reservation.reservationType,
          startTime: reservation.startTime.toString(),
          endTime: reservation.endTime.toString(),
          duration: reservation.duration.toString(),
          quantity: reservation.quantity.toString(),
          price: reservation.price.toString(),
          reservationId: savedReservation.id.toString(),
          reservationStatus: savedReservation.status,
        });

      try {
        this.notificationService.sendEmail({
          to: user.email,
          subject: 'Reservation Confirmation',
          text: emailTemplate,
        });
      } catch {
        new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Error send email',
        });
      }

      return {
        id: savedReservation.id,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async getMyReservations(username: string): Promise<ReservationEntity[]> {
    try {
      const reservations = await this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.resource', 'resource')
        .leftJoinAndSelect('reservation.user', 'user')
        .where('reservation.status != :status', { status: 'cancelled' })
        .andWhere('user.username = :username', {
          username,
        })
        .getMany();

      return instanceToPlain(reservations) as ReservationEntity[];
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  // add pagination
  async getAllReservations(
    pagination: Pagination,
  ): Promise<ReservationEntity[]> {
    try {
      const offset = (pagination.page - 1) * pagination.limit;

      const reservations = await this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.resource', 'resource')
        .leftJoinAndSelect('reservation.user', 'user')
        .offset(offset)
        .limit(pagination.limit)
        .orderBy('reservation.date', pagination.sortOrder || 'DESC')
        .getMany();

      return reservations;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}
