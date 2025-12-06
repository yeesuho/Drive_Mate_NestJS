import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CarService } from './car.service';
import { RegisterCarDto } from './dto/register-car.dto';
import { UpdateCarDistanceDto } from './dto/update-car-distance.dto';
import { UpdateCarAllDto } from './dto/update-car-all.dto';
import { AuthenticateService } from '../authenticate/authenticate.service';

/**
 * Controller exposing the car management API.  Every endpoint requires
 * authentication via a bearer token.  Calls will throw an error if the
 * provided token is not valid.
 */
@Controller()
export class CarController {
  constructor(
    private readonly carService: CarService,
    private readonly authService: AuthenticateService,
  ) {}

  /**
   * Validate the Authorization header.  Throws on invalid or missing token.
   */
  private verifyToken(authHeader: string | undefined) {
    const token = authHeader?.split(' ')[1];
    const userId = token ? this.authService.validateToken(token) : null;
    if (!userId) {
      throw new Error('Invalid token');
    }
    return userId;
  }

  /**
   * Register a new car with optional image upload.  The image is saved to
   * the uploads folder and its URL is stored with the car record.
   */
  @Post('car')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          // Store uploaded files in the top‑level uploads directory (not in dist)
          cb(null, join(__dirname, '..', '..', 'uploads'));
        },
        filename: (_req, file, cb) => {
          const unique = uuidv4().replace(/-/g, '');
          const ext = extname(file.originalname);
          cb(null, `${unique}${ext}`);
        },
      }),
    }),
  )
  async register(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: RegisterCarDto,
    @Headers('authorization') authorization: string,
  ) {
    this.verifyToken(authorization);
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    const car = this.carService.register(dto, imageUrl);
    return {
      STATUS_CD: 'S0000',
      STATUS_MSG: 'SUCCESS',
      RESULT: {
        carId: car.carId,
        carNm: car.carNm,
        carNo: car.carNo,
        carImgUrl: car.carImgUrl,
      },
    };
  }

  /**
   * Register a new car without an image.  This endpoint exists solely
   * because the competition specification provides two separate paths when
   * file upload is not possible.
   */
  @Post('car-noupload')
  async registerNoUpload(
    @Body() dto: RegisterCarDto,
    @Headers('authorization') authorization: string,
  ) {
    this.verifyToken(authorization);
    const car = this.carService.register(dto);
    return {
      STATUS_CD: 'S0000',
      STATUS_MSG: 'SUCCESS',
      RESULT: {
        carId: car.carId,
        carNm: car.carNm,
        carNo: car.carNo,
      },
    };
  }

  /**
   * Retrieve a list of all registered cars.  Only summary information is
   * returned.
   */
  @Get('car')
  async findAll(@Headers('authorization') authorization: string) {
    this.verifyToken(authorization);
    const cars = this.carService.findAll();
    return { STATUS_CD: 'S0000', STATUS_MSG: 'SUCCESS', RESULT: cars };
  }

  /**
   * Retrieve a single car.  When detailYn=Y the full record is returned; otherwise
   * only summary information is provided.
   */
  @Get('car/:carId')
  async findOne(
    @Param('carId') carId: string,
    @Query('detailYn') detailYn: string | undefined,
    @Headers('authorization') authorization: string,
  ) {
    this.verifyToken(authorization);
    const car = this.carService.findOne(carId);
    const detail = detailYn && detailYn.toUpperCase() === 'Y';
    const result = detail
      ? car
      : {
          carId: car.carId,
          carNm: car.carNm,
          carNo: car.carNo,
          carImgUrl: car.carImgUrl,
        };
    return { STATUS_CD: 'S0000', STATUS_MSG: 'SUCCESS', RESULT: result };
  }

  /**
   * Delete a car.  Always returns success; errors propagate to the filter.
   */
  @Delete('car/:carId')
  async remove(
    @Param('carId') carId: string,
    @Headers('authorization') authorization: string,
  ) {
    this.verifyToken(authorization);
    this.carService.deleteCar(carId);
    return { STATUS_CD: 'S0000', STATUS_MSG: 'SUCCESS', RESULT: null };
  }

  /**
   * Toggle the engine state (start/stop).
   */
  @Put('car/:carId/strtg')
  async updateStrtg(
    @Param('carId') carId: string,
    @Body() body: { strtgYn: 'Y' | 'N' },
    @Headers('authorization') authorization: string,
  ) {
    this.verifyToken(authorization);
    const car = this.carService.updateStrtg(carId, body.strtgYn);
    return {
      STATUS_CD: 'S0000',
      STATUS_MSG: 'SUCCESS',
      RESULT: { carId: car.carId, strtgYn: car.strtgYn },
    };
  }

  /**
   * Toggle the door state (lock/unlock).
   */
  @Put('car/:carId/door')
  async updateDoor(
    @Param('carId') carId: string,
    @Body() body: { doorYn: 'Y' | 'N' },
    @Headers('authorization') authorization: string,
  ) {
    this.verifyToken(authorization);
    const car = this.carService.updateDoor(carId, body.doorYn);
    return {
      STATUS_CD: 'S0000',
      STATUS_MSG: 'SUCCESS',
      RESULT: { carId: car.carId, doorYn: car.doorYn },
    };
  }

  /**
   * Toggle the window state (open/close).
   */
  @Put('car/:carId/wndw')
  async updateWndw(
    @Param('carId') carId: string,
    @Body() body: { wndwYn: 'Y' | 'N' },
    @Headers('authorization') authorization: string,
  ) {
    this.verifyToken(authorization);
    const car = this.carService.updateWndw(carId, body.wndwYn);
    return {
      STATUS_CD: 'S0000',
      STATUS_MSG: 'SUCCESS',
      RESULT: { carId: car.carId, wndwYn: car.wndwYn },
    };
  }

  /**
   * Toggle the emergency lamp state (on/off).
   */
  @Put('car/:carId/emgncLmp')
  async updateEmgncLmp(
    @Param('carId') carId: string,
    @Body() body: { emgncLmpYn: 'Y' | 'N' },
    @Headers('authorization') authorization: string,
  ) {
    this.verifyToken(authorization);
    const car = this.carService.updateEmgncLmp(carId, body.emgncLmpYn);
    return {
      STATUS_CD: 'S0000',
      STATUS_MSG: 'SUCCESS',
      RESULT: { carId: car.carId, emgncLmpYn: car.emgncLmpYn },
    };
  }

  /**
   * Update the driving distance for a car.
   */
  @Put('car/:carId/drvngPosblDstnc')
  async updateDistance(
    @Param('carId') carId: string,
    @Body() body: UpdateCarDistanceDto,
    @Headers('authorization') authorization: string,
  ) {
    this.verifyToken(authorization);
    const car = this.carService.updateDistance(carId, body.drvngPosblDstnc);
    return {
      STATUS_CD: 'S0000',
      STATUS_MSG: 'SUCCESS',
      RESULT: { carId: car.carId, drvngPosblDstnc: car.drvngPosblDstnc },
    };
  }

  /**
   * Bulk update multiple properties on a car.  Only provided fields will
   * override existing values.
   */
  @Put('car/:carId')
  async updateAll(
    @Param('carId') carId: string,
    @Body() body: UpdateCarAllDto,
    @Headers('authorization') authorization: string,
  ) {
    this.verifyToken(authorization);
    const car = this.carService.updateAll(carId, body);
    return { STATUS_CD: 'S0000', STATUS_MSG: 'SUCCESS', RESULT: car };
  }
}