import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { VehicleStatus } from './vehicle-status.entity';
import { ClimateStatus } from './climate-status.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Q8, AUDI A8 등

  @Column()
  plateNumber: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 100 })
  remainingRangeKm: number;

  @Column({ default: '서울시 어딘가' })
  locationText: string;

  @Column({ default: false })
  isSelected: boolean;

  @ManyToOne(() => User, (user) => user.vehicles, { onDelete: 'CASCADE' })
  owner: User;

  @OneToOne(() => VehicleStatus, { cascade: true, eager: true })
  @JoinColumn()
  vehicleStatus: VehicleStatus;

  @OneToOne(() => ClimateStatus, { cascade: true, eager: true })
  @JoinColumn()
  climateStatus: ClimateStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
