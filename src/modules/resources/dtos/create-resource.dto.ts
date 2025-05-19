import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['room', 'consulting', 'coworking'])
  type: 'room' | 'consulting' | 'coworking';

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  capacity: number;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsIn(['hour', 'day', 'week', 'month'])
  duration: 'hour' | 'day' | 'week' | 'month';
}
