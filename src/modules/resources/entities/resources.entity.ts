// src/modules/resources/entities/resource.entity.ts
import { BaseEntity } from 'src/config/baseEntity';
import { ReservationEntity } from 'src/modules/reservations/entities/reservation.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity('resources')
export class ResourceEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  type: 'room' | 'consulting' | 'coworking';

  @Column()
  location: string;

  @Column()
  capacity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'day' })
  reservationType: 'hour' | 'day' | 'week' | 'month';

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isAvailable: boolean;

  @Column('varchar', {
    array: true,
    nullable: true,
    default: () => 'ARRAY[]::varchar[]',
  })
  images: string[];

  @OneToMany(() => ReservationEntity, (reservation) => reservation.resource)
  reservations: ReservationEntity[];
}
