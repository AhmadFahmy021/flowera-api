import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('user/home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get("")
  getAllData(){
    return this.homeService.index();
  }
}
