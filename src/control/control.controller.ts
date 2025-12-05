import { Controller, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ControlService } from './control.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('control')
export class ControlController {
  constructor(private readonly controlService: ControlService) {}

  // 선택된 차량 기준으로 동작, ?vehicleId= 로 특정 차량 지정도 가능

  @Post('engine/on')
  engineOn(@CurrentUser() user: any, @Query('vehicleId') vehicleId?: number) {
    return this.controlService.engineOn(user.userId, vehicleId && +vehicleId);
  }

  @Post('engine/off')
  engineOff(@CurrentUser() user: any, @Query('vehicleId') vehicleId?: number) {
    return this.controlService.engineOff(user.userId, vehicleId && +vehicleId);
  }

  @Post('door/lock')
  doorLock(@CurrentUser() user: any, @Query('vehicleId') vehicleId?: number) {
    return this.controlService.doorLock(user.userId, vehicleId && +vehicleId);
  }

  @Post('door/unlock')
  doorUnlock(@CurrentUser() user: any, @Query('vehicleId') vehicleId?: number) {
    return this.controlService.doorUnlock(user.userId, vehicleId && +vehicleId);
  }

  @Post('window/open')
  windowOpen(@CurrentUser() user: any, @Query('vehicleId') vehicleId?: number) {
    return this.controlService.windowOpen(user.userId, vehicleId && +vehicleId);
  }

  @Post('window/close')
  windowClose(@CurrentUser() user: any, @Query('vehicleId') vehicleId?: number) {
    return this.controlService.windowClose(user.userId, vehicleId && +vehicleId);
  }

  @Post('hazard/on')
  hazardOn(@CurrentUser() user: any, @Query('vehicleId') vehicleId?: number) {
    return this.controlService.hazardOn(user.userId, vehicleId && +vehicleId);
  }

  @Post('hazard/off')
  hazardOff(@CurrentUser() user: any, @Query('vehicleId') vehicleId?: number) {
    return this.controlService.hazardOff(user.userId, vehicleId && +vehicleId);
  }
}
