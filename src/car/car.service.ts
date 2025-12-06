import { Injectable } from '@nestjs/common';
import { Car } from './entities/car.entity';
import { RegisterCarDto } from './dto/register-car.dto';
import { UpdateCarAllDto } from './dto/update-car-all.dto';

/**
 * Service responsible for managing car records.  All data is kept in
 * memory for the scope of the competition.  Each update operation
 * persists changes directly into the Map.
 */
@Injectable()
export class CarService {
  private cars = new Map<string, Car>();

  /**
   * Register a new car.  An optional image URL may be supplied.  The
   * returned object is the full car record.
   */
  register(dto: RegisterCarDto, imageUrl?: string): Car {
    const car = new Car({
      carNm: dto.carNm,
      carNo: dto.carNo,
    });
    if (imageUrl) {
      car.carImgUrl = imageUrl;
    }
    this.cars.set(car.carId, car);
    return car;
  }

  /**
   * Return a summary list of all cars.  Only the fields required by the
   * list API are included.
   */
  findAll() {
    return Array.from(this.cars.values()).map((car) => ({
      carId: car.carId,
      carNm: car.carNm,
      carNo: car.carNo,
      carImgUrl: car.carImgUrl,
    }));
  }

  /**
   * Find a single car by its ID.  Throws if not found.
   */
  findOne(carId: string): Car {
    const car = this.cars.get(carId);
    if (!car) {
      throw new Error('Car not found');
    }
    return car;
  }

  /**
   * Remove a car from the collection.  Throws if it does not exist.
   */
  deleteCar(carId: string) {
    if (!this.cars.has(carId)) {
      throw new Error('Car not found');
    }
    this.cars.delete(carId);
  }

  /**
   * Update the engine start/stop flag.
   */
  updateStrtg(carId: string, yn: 'Y' | 'N'): Car {
    const car = this.findOne(carId);
    car.strtgYn = yn;
    return car;
  }

  /**
   * Update the door lock/unlock flag.
   */
  updateDoor(carId: string, yn: 'Y' | 'N'): Car {
    const car = this.findOne(carId);
    car.doorYn = yn;
    return car;
  }

  /**
   * Update the window open/close flag.
   */
  updateWndw(carId: string, yn: 'Y' | 'N'): Car {
    const car = this.findOne(carId);
    car.wndwYn = yn;
    return car;
  }

  /**
   * Update the emergency light flag.
   */
  updateEmgncLmp(carId: string, yn: 'Y' | 'N'): Car {
    const car = this.findOne(carId);
    car.emgncLmpYn = yn;
    return car;
  }

  /**
   * Update the remaining driving distance.
   */
  updateDistance(carId: string, distance: number): Car {
    const car = this.findOne(carId);
    car.drvngPosblDstnc = distance;
    return car;
  }

  /**
   * Bulk update of multiple fields.  Only provided fields are updated.
   */
  updateAll(carId: string, dto: UpdateCarAllDto): Car {
    const car = this.findOne(carId);
    // Assign properties individually so as not to override the car ID
    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // @ts-ignore: dynamic assignment of known fields
        (car as any)[key] = value;
      }
    });
    return car;
  }
}