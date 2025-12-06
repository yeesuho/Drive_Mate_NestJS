import { Module } from '@nestjs/common';
import { AuthenticateModule } from './authenticate/authenticate.module';
import { CarModule } from './car/car.module';

@Module({
  imports: [AuthenticateModule, CarModule],
})
export class AppModule {}