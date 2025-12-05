import { Controller, Get, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  // GET /api/home  → 홈 화면 전체 데이터
  @Get()
  getHome(@CurrentUser() user: any) {
    return this.homeService.getHomeData(user.userId);
  }
}
