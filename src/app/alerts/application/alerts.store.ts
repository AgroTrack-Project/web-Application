import { Injectable, signal } from '@angular/core';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertsApi } from '../infrastructure/alerts-api';
import { AlertNotification } from '../domain/model/alerts-notification.entity';

@Injectable({
  providedIn: 'root'
})
export class AlertsStore {

  alerts = signal<AlertNotification[]>([]);
  loading = signal(false);

  private activeRequest?: Subscription;

  constructor(private alertsApi: AlertsApi) {}

  loadWeather(city: string): void {
    this.loadWeatherForCities([city]);
  }

  loadWeatherForCities(cities: string[]): void {
    this.activeRequest?.unsubscribe();

    const uniqueCities = [...new Set(cities)];
    if (uniqueCities.length === 0) {
      this.alerts.set([]);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.activeRequest = forkJoin(
      uniqueCities.map(city =>
        this.alertsApi.getAlertsByCity(city).pipe(
          catchError(error => {
            console.error(error);
            return of<AlertNotification[]>([]);
          })
        )
      )
    ).subscribe(results => {
      this.alerts.set(results.flat());
      this.loading.set(false);
    });
  }
}
