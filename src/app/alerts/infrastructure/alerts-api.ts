import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { ClimateEntity } from '../domain/model/climate.entity';
import { ClimateResponse } from './climate-response';
import { ClimateAssembler } from './climate-assembler';
import { ClimateApiEndpoint } from './climate-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class AlertsApi {

  private http = inject(HttpClient);

  getWeatherByCity(city: string): Observable<ClimateEntity> {

    const endpoint = ClimateApiEndpoint.weatherByCity(city);

    return this.http
      .get<ClimateResponse>(endpoint)
      .pipe(
        map(response =>
          ClimateAssembler.toEntity(response)        )
      );
  }
}
