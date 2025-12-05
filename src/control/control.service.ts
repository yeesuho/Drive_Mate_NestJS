import { Injectable } from '@nestjs/common';
import { VehiclesService } from '../vehicles/vehicles.service';

@Injectable()
export class ControlService {
  constructor(private readonly vehiclesService: VehiclesService) {}

  private async getVehicle(ownerId: number, vehicleId?: number) {
    if (vehicleId) return this.vehiclesService.findOneForOwner(ownerId, vehicleId);
    return this.vehiclesService.getSelectedVehicle(ownerId);
  }

  async engineOn(ownerId: number, vehicleId?: number) {
    const v = await this.getVehicle(ownerId, vehicleId);
    v.vehicleStatus.engineOn = true;
    await this.vehiclesService['vehicleRepo'].save(v); // 간단히 접근
    return { message: '시동을 켰습니다.', engineOn: true };
  }

  async engineOff(ownerId: number, vehicleId?: number) {
    const v = await this.getVehicle(ownerId, vehicleId);
    v.vehicleStatus.engineOn = false;
    await this.vehiclesService['vehicleRepo'].save(v);
    return { message: '시동을 껐습니다.', engineOn: false };
  }

  async doorLock(ownerId: number, vehicleId?: number) {
    const v = await this.getVehicle(ownerId, vehicleId);
    v.vehicleStatus.doorsLocked = true;
    await this.vehiclesService['vehicleRepo'].save(v);
    return { message: '도어를 잠갔습니다.', doorsLocked: true };
  }

  async doorUnlock(ownerId: number, vehicleId?: number) {
    const v = await this.getVehicle(ownerId, vehicleId);
    v.vehicleStatus.doorsLocked = false;
    await this.vehiclesService['vehicleRepo'].save(v);
    return { message: '도어를 열었습니다.', doorsLocked: false };
  }

  async windowClose(ownerId: number, vehicleId?: number) {
    const v = await this.getVehicle(ownerId, vehicleId);
    v.vehicleStatus.windowsClosed = true;
    await this.vehiclesService['vehicleRepo'].save(v);
    return { message: '창문을 닫았습니다.', windowsClosed: true };
  }

  async windowOpen(ownerId: number, vehicleId?: number) {
    const v = await this.getVehicle(ownerId, vehicleId);
    v.vehicleStatus.windowsClosed = false;
    await this.vehiclesService['vehicleRepo'].save(v);
    return { message: '창문을 열었습니다.', windowsClosed: false };
  }

  async hazardOn(ownerId: number, vehicleId?: number) {
    const v = await this.getVehicle(ownerId, vehicleId);
    v.vehicleStatus.hazardOn = true;
    await this.vehiclesService['vehicleRepo'].save(v);
    return { message: '비상등을 켰습니다.', hazardOn: true };
  }

  async hazardOff(ownerId: number, vehicleId?: number) {
    const v = await this.getVehicle(ownerId, vehicleId);
    v.vehicleStatus.hazardOn = false;
    await this.vehiclesService['vehicleRepo'].save(v);
    return { message: '비상등을 껐습니다.', hazardOn: false };
  }
}
