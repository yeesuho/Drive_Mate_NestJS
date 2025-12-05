import { Injectable } from '@nestjs/common';
import { VehiclesService } from '../vehicles/vehicles.service';

@Injectable()
export class HomeService {
  constructor(private readonly vehiclesService: VehiclesService) {}

  // 선택된 차량 기준 홈 데이터
  async getHomeData(ownerId: number) {
    const vehicle = await this.vehiclesService.getSelectedVehicle(ownerId);

    // 실제 대회에서는 외부 날씨 API / GPS 연동. 여기선 mock.
    const weather = {
      temperature: 21,
      icon: 'sunny',
      locationText: vehicle.locationText,
    };

    const status = vehicle.vehicleStatus;

    return {
      vehicle: {
        id: vehicle.id,
        name: vehicle.name,
        imageUrl: vehicle.imageUrl,
        remainingRangeKm: vehicle.remainingRangeKm,
      },
      weather,
      ranges: {
        remainingKm: vehicle.remainingRangeKm,
        level:
          vehicle.remainingRangeKm < 50
            ? 'low'
            : vehicle.remainingRangeKm <= 100
            ? 'medium'
            : 'high',
      },
      quickStatus: {
        engineOn: status.engineOn,
        doorsLocked: status.doorsLocked,
        windowsClosed: status.windowsClosed,
        hazardOn: status.hazardOn,
      },
    };
  }
}
