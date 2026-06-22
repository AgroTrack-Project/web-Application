import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { AlertNotification } from '../domain/model/alerts-notification.entity';
import { AlertResource } from './climate-response';
import { ClimateAssembler } from './climate-assembler';
import { ClimateApiEndpoint } from './climate-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class AlertsApi {

  private http = inject(HttpClient);

  getAlertsByCity(city: string): Observable<AlertNotification[]> {
    const endpoint = ClimateApiEndpoint.alertsByCity(city);
    return this.http
      .get<AlertResource[]>(endpoint)
      .pipe(
        map(resources => resources.map(r => ClimateAssembler.toNotification(r)))
      );
  }
}
