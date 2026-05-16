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

/**
 * Store responsible for:
 * - Managing climate information
 * - Generating climate alerts
 * - Handling loading states
 */
@Injectable({
  providedIn: 'root'
})
export class AlertsStore {

  /**
   * Stores current climate data.
   */
  climate = signal<ClimateEntity | null>(null);

  /**
   * Stores generated climate alerts.
   */
  alerts = signal<AlertNotification[]>([]);

  /**
   * Indicates when API data is loading.
   */
  loading = signal(false);

  constructor(
    private alertsApi: AlertsApi
  ) {}

  /**
   * Loads weather information for a city
   * and generates alerts based on risks.
   *
   * @param city City name to analyze.
   */
  loadWeather(city: string): void {

    this.loading.set(true);

    this.alertsApi
      .getWeatherByCity(city)
      .subscribe({

        next: (response) => {

          /**
           * Stores climate response
           * obtained from OpenWeather API.
           */
          this.climate.set(response);

          /**
           * Generates alerts according
           * to detected climate risks.
           */
          const generatedAlerts =
            AlertGenerator.generateAlerts(
              response
            );

          /**
           * Updates alert list.
           */
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

  /**
   * Loads weather information
   * for multiple cities.
   *
   * @param cities List of cities.
   */
  loadWeatherForCities(
    cities: string[]
  ): void {

    this.loading.set(true);

    /**
     * Clears previous alerts
     * before loading new ones.
     */
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

            /**
             * Adds new alerts without
             * removing existing ones.
             */
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
