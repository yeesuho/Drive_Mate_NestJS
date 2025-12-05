import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('vehicle_status')
export class VehicleStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  engineOn: boolean;

  @Column({ default: false })
  doorsLocked: boolean;

  @Column({ default: false })
  windowsClosed: boolean;

  @Column({ default: false })
  hazardOn: boolean;

  @Column({ default: false })
  tailgateClosed: boolean;

  @Column({ default: false })
  hoodClosed: boolean;

  @OneToOne(() => Vehicle, (v) => v.vehicleStatus)
  vehicle: Vehicle;
}
