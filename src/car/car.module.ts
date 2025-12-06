import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { AuthenticateModule } from '../authenticate/authenticate.module';

@Module({
  imports: [AuthenticateModule],
  providers: [CarService],
  controllers: [CarController],
})
export class CarModule {}