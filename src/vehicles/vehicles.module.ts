import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleStatus } from './entities/vehicle-status.entity';
import { ClimateStatus } from './entities/climate-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, VehicleStatus, ClimateStatus])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
