import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Express } from 'express';

function filenameGenerator(req, file, cb) {
  const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, unique + extname(file.originalname));
}

@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  // 차량 추가 (이미지 없이)
  @Post()
  create(
    @CurrentUser() user: any,
    @Body() dto: CreateVehicleDto,
  ) {
    return this.vehiclesService.create(user.userId, dto);
  }

  // 차량 목록 조회
  @Get()
  findAll(@CurrentUser() user: any) {
    return this.vehiclesService.findAllByOwner(user.userId);
  }

  // 특정 차량 조회
  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id') id: number) {
    return this.vehiclesService.findOneForOwner(user.userId, +id);
  }

  // 차량 정보 수정
  @Patch(':id')
  update(
    @CurrentUser() user: any,
    @Param('id') id: number,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(user.userId, +id, dto);
  }

  // 차량 삭제
  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: number) {
    return this.vehiclesService.remove(user.userId, +id);
  }

  // 이 차량 선택하기 (Home 진입용)
  @Patch(':id/select')
  select(@CurrentUser() user: any, @Param('id') id: number) {
    return this.vehiclesService.selectVehicle(user.userId, +id);
  }

  // 이미지 포함 차량 등록 / 변경
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: filenameGenerator,
      }),
    }),
  )
  uploadImage(
    @CurrentUser() user: any,
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url = `/uploads/${file.filename}`;
    return this.vehiclesService.updateImage(user.userId, +id, url);
  }
}
