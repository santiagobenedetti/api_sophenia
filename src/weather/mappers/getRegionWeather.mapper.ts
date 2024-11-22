/* eslint-disable @typescript-eslint/no-unused-vars */
import { WeatherData } from '../types/weather';

export const mapGetRegionWeatherData = (weatherData: WeatherData) => {
  const { alerts, days, ...otherWeatherData } = weatherData;
  return {
    ...otherWeatherData,
    days: days.slice(0, 7).map((day) => {
      const { hours, ...otherDayData } = day;
      return {
        ...otherDayData,
      };
    }),
  };
};
