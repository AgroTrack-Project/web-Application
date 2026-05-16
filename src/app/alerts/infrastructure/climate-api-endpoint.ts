import { environment } from '../../../environments/environment.development';

export class ClimateApiEndpoint {

  static weatherByCity(city: string): string {

    return `${environment.openWeatherApiUrl}/weather?q=${city}&appid=${environment.openWeatherApiKey}&units=metric`;
  }
}
