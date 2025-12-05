import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleStatus } from './entities/vehicle-status.entity';
import { ClimateStatus } from './entities/climate-status.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(VehicleStatus)
    private vehicleStatusRepo: Repository<VehicleStatus>,
    @InjectRepository(ClimateStatus)
    private climateStatusRepo: Repository<ClimateStatus>,
  ) {}

  async create(ownerId: number, dto: CreateVehicleDto, imageUrl?: string) {
    const vehicleStatus = this.vehicleStatusRepo.create({});
    const climateStatus = this.climateStatusRepo.create({});

    const vehicle = this.vehicleRepo.create({
      ...dto,
      imageUrl,
      owner: { id: ownerId } as any,
      vehicleStatus,
      climateStatus,
    });

    await this.vehicleStatusRepo.save(vehicleStatus);
    await this.climateStatusRepo.save(climateStatus);
    return this.vehicleRepo.save(vehicle);
  }

  async findAllByOwner(ownerId: number) {
    return this.vehicleRepo.find({
      where: { owner: { id: ownerId } },
      order: { id: 'ASC' },
    });
  }

  async findOneForOwner(ownerId: number, id: number) {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id, owner: { id: ownerId } },
    });
    if (!vehicle) throw new NotFoundException('차량을 찾을 수 없습니다.');
    return vehicle;
  }

  async update(ownerId: number, id: number, dto: UpdateVehicleDto) {
    const vehicle = await this.findOneForOwner(ownerId, id);
    Object.assign(vehicle, dto);
    return this.vehicleRepo.save(vehicle);
  }

  async remove(ownerId: number, id: number) {
    const vehicle = await this.findOneForOwner(ownerId, id);
    await this.vehicleRepo.remove(vehicle);
    return { message: '차량이 삭제되었습니다.' };
  }

  async selectVehicle(ownerId: number, id: number) {
    const vehicle = await this.findOneForOwner(ownerId, id);

    // 기존 선택 해제
    await this.vehicleRepo.update(
      { owner: { id: ownerId }, isSelected: true },
      { isSelected: false },
    );

    vehicle.isSelected = true;
    await this.vehicleRepo.save(vehicle);
    return { message: '해당 차량이 선택되었습니다.' };
  }

  async getSelectedVehicle(ownerId: number) {
    const selected = await this.vehicleRepo.findOne({
      where: { owner: { id: ownerId }, isSelected: true },
    });
    if (!selected) {
      throw new BadRequestException('선택된 차량이 없습니다.');
    }
    return selected;
  }

  async updateImage(ownerId: number, id: number, imageUrl: string) {
    const vehicle = await this.findOneForOwner(ownerId, id);
    vehicle.imageUrl = imageUrl;
    return this.vehicleRepo.save(vehicle);
  }
}
