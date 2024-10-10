import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('images')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('restaurants')
  getImages() {
    return this.appService.getImages();
  }
}
