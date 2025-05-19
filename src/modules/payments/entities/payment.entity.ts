// src/modules/payments/entities/payment.entity.ts
import { BaseEntity } from 'src/config/baseEntity';
import { ReservationEntity } from 'src/modules/reservations/entities/reservation.entity';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('payments')
export class PaymentEntity extends BaseEntity {
  @OneToOne(() => ReservationEntity)
  @JoinColumn()
  reservation: ReservationEntity;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  method: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  transactionId: string;
}
