import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('climate_status')
export class ClimateStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  airConditioningOn: boolean; // 냉/난방

  @Column({ default: false })
  steeringHeaterOn: boolean;

  @Column({ default: false })
  frontDefoggerOn: boolean;

  @Column({ default: false })
  rearDefoggerOn: boolean;

  @Column({ default: false })
  mirrorHeaterOn: boolean;

  @OneToOne(() => Vehicle, (v) => v.climateStatus)
  vehicle: Vehicle;
}
