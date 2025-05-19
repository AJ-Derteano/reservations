import { IsDateString, IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  resourceId: number;

  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsIn(['hour', 'day', 'week', 'month'])
  reservationType: 'hour' | 'day' | 'week' | 'month';

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  quantity: number;
}
