import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import { WeatherData } from './types/weather';
import { mapGetRegionWeatherData } from './mappers/getRegionWeather.mapper';

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

  getRegionWeather() {
    return this.httpService
      .get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${process.env.LATITUDE_AND_LONGITUDE_SOPHENIA}?unitGroup=metric&key=${process.env.WEATHER_API_KEY}&contentType=json`,
      )
      .pipe(
        map((response: AxiosResponse<WeatherData>) =>
          mapGetRegionWeatherData(response.data),
        ),
      );
  }
}
