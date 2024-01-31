import { wmoWeatherCodes } from '../data/wmo-weather-codes';

export interface LatLng {
  name?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeatherInfo {
  temperatureCelsius: number;
  weather: string;
  currentTime: string;
}

export class WeatherService {
  private async callOpenMeteo(ep: string, params: any, api = 'api'): Promise<any> {
    const res = await fetch(`https://${api}.open-meteo.com/v1/${ep}?${new URLSearchParams(params)}`);
    return res.json();
  }

  async geocode(cityNameOrZipCode: string): Promise<LatLng | null> {
    const [found] = (await this.callOpenMeteo('search', {
      name: cityNameOrZipCode,
      count: 1,
      language: 'en',
      format: 'json',
    }, 'geocoding-api'))?.results ?? [];

    if (!found || !found.name || !found.latitude) {
      return null;
    }

    return {
      name: found.name,
      latitude: found.latitude,
      longitude: found.longitude,
    };
  }

  private wmoCodeToWeather(isDay: boolean, weathercode: number | string): string {
    return wmoWeatherCodes[`${weathercode}`][isDay ? 'day' : 'night'].description;
  }

  async getCurrentWeather(lanLng: LatLng): Promise<CurrentWeatherInfo> {
    const res = await this.callOpenMeteo('forecast', {
      latitude: lanLng.latitude,
      longitude: lanLng.longitude,
      current_weather: true,
      timezone: 'auto',
    });

    if (!res || !res.current_weather) {
      throw new Error('Cannot get weather information.');
    }

    const {is_day: isDay, temperature: temperatureCelsius, weathercode} = res.current_weather;

    const weather = this.wmoCodeToWeather(isDay, weathercode);

    return {
      temperatureCelsius,
      weather,
      currentTime: (new Date()).toISOString(),
    };
  }
}