import { Injectable, signal } from '@angular/core';

import { AlertsApi } from '../infrastructure/alerts-api';
import { AlertNotification } from '../domain/model/alerts-notification.entity';

@Injectable({
  providedIn: 'root'
})
export class AlertsStore {

  alerts = signal<AlertNotification[]>([]);
  loading = signal(false);

  constructor(private alertsApi: AlertsApi) {}

  loadWeather(city: string): void {
    this.loading.set(true);
    this.alertsApi.getAlertsByCity(city).subscribe({
      next: (alerts) => {
        this.alerts.set(alerts);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.loading.set(false);
      }
    });
  }

  loadWeatherForCities(cities: string[]): void {
    this.alerts.set([]);
    if (cities.length === 0) {
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    cities.forEach(city => {
      this.alertsApi.getAlertsByCity(city).subscribe({
        next: (alerts) => {
          this.alerts.update(current => [...current, ...alerts]);
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.loading.set(false);
        }
      });
    });
  }
}
