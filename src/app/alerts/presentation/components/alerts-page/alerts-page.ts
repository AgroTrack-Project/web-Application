import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { WeatherCardComponent } from '../../components/weather-card/weather-card';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [
    CommonModule,
    WeatherCardComponent
  ],
  templateUrl: './alerts-page.html'
})
export class AlertsPageComponent {}
