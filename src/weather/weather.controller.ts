import { Controller, Get, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { WeatherRoutesEnum } from './enums/weather.enum';
import { WeatherService } from './weather.service';

@ApiTags(WeatherRoutesEnum.weather)
@Controller(WeatherRoutesEnum.weather)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth('access-token')
  @Get()
  async getRegionWeather() {
    const weather = await this.weatherService.getRegionWeather();

    return weather;
  }
}
