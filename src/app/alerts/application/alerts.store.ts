import {
  Injectable,
  signal
} from '@angular/core';

import { ClimateEntity }
  from '../domain/model/climate.entity';

import { AlertsApi }
  from '../infrastructure/alerts-api';

import { AlertNotification }
  from '../domain/model/alerts-notification.entity';

import { AlertGenerator }
  from '../domain/service/alert-generator';

@Injectable({
  providedIn: 'root'
})
export class AlertsStore {

  climate = signal<ClimateEntity | null>(null);

  alerts = signal<AlertNotification[]>([]);

  loading = signal(false);

  constructor(
    private alertsApi: AlertsApi
  ) {}

  loadWeather(city: string): void {

    this.loading.set(true);

    this.alertsApi
      .getWeatherByCity(city)
      .subscribe({

        next: (response) => {

          this.climate.set(response);

          const generatedAlerts =
            AlertGenerator.generateAlerts(
              response
            );

          this.alerts.set(
            generatedAlerts
          );

          this.loading.set(false);
        },

        error: (error) => {

          console.error(error);

          this.loading.set(false);
        }
      });
  }

  loadWeatherForCities(
    cities: string[]
  ): void {

    this.loading.set(true);

    this.alerts.set([]);

    cities.forEach(city => {

      this.alertsApi
        .getWeatherByCity(city)
        .subscribe({

          next: (response) => {

            const generatedAlerts =
              AlertGenerator.generateAlerts(
                response
              );

            this.alerts.update(current => [

              ...current,

              ...generatedAlerts

            ]);
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
