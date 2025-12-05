import { Injectable } from '@nestjs/common';
import { VehiclesService } from '../vehicles/vehicles.service';

@Injectable()
export class StatusService {
  constructor(private readonly vehiclesService: VehiclesService) {}

  async getVehicleStatus(ownerId: number) {
    const v = await this.vehiclesService.getSelectedVehicle(ownerId);
    const s = v.vehicleStatus;
    return {
      door: s.doorsLocked ? '잠김' : '열림',
      window: s.windowsClosed ? '닫힘' : '열림',
      tailgate: s.tailgateClosed ? '닫힘' : '열림',
      hood: s.hoodClosed ? '닫힘' : '열림',
    };
  }

  async getClimateStatus(ownerId: number) {
    const v = await this.vehiclesService.getSelectedVehicle(ownerId);
    const c = v.climateStatus;
    return {
      airConditioning: c.airConditioningOn ? '켜짐' : '꺼짐',
      steeringHeater: c.steeringHeaterOn ? '켜짐' : '꺼짐',
      frontDefogger: c.frontDefoggerOn ? '켜짐' : '꺼짐',
      rearDefogger: c.rearDefoggerOn ? '켜짐' : '꺼짐',
      mirrorHeater: c.mirrorHeaterOn ? '켜짐' : '꺼짐',
    };
  }

  // 탭 눌렀을 때마다 호출된다고 가정
}
