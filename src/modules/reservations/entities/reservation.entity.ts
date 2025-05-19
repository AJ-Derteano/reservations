import { BaseEntity } from 'src/config/baseEntity';
import { ResourceEntity } from 'src/modules/resources/entities/resources.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('reservations')
export class ReservationEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { eager: true })
  user: UserEntity;

  @ManyToOne(() => ResourceEntity, (resource) => resource.reservations)
  resource: ResourceEntity;

  @Column()
  date: Date;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  reservationType: 'hour' | 'day' | 'week' | 'month';

  @Column()
  duration: number;

  @Column()
  quantity: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'cancelled';

  @Column({ default: 'pending' })
  paymentStatus: 'pending' | 'confirmed' | 'cancelled';
}
