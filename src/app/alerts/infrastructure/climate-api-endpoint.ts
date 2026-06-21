import { environment } from '../../../environments/environment';

export class ClimateApiEndpoint {

  static alertsByCity(city: string): string {
    return `${environment.apiBaseUrl}/alerts?city=${city}`;
  }
}
