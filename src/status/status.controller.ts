import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatusService } from './status.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  // 차량 탭
  @Get('vehicle')
  getVehicleStatus(@CurrentUser() user: any) {
    return this.statusService.getVehicleStatus(user.userId);
  }

  // 공조 탭
  @Get('climate')
  getClimateStatus(@CurrentUser() user: any) {
    return this.statusService.getClimateStatus(user.userId);
  }
}
