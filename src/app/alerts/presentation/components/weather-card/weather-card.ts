import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule }
  from '@angular/common';

import { AlertsStore }
  from '../../../application/alerts.store';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-card.html',
  styleUrls: ['./weather-card.css']
})
export class WeatherCardComponent
  implements OnInit {

  store = inject(AlertsStore);

  cities = [
    'Chachapoyas',
    'Huaraz',
    'Abancay',
    'Arequipa',
    'Ayacucho',
    'Cajamarca',
    'Callao',
    'Cusco',
    'Huancavelica',
    'Huanuco',
    'Ica',
    'Huancayo',
    'Trujillo',
    'Chiclayo',
    'Lima',
    'Iquitos',
    'Puerto Maldonado',
    'Moquegua',
    'Cerro de Pasco',
    'Piura',
    'Puno',
    'Moyobamba',
    'Tacna',
    'Tumbes',
    'Pucallpa'
  ];

  ngOnInit(): void {

    this.store.loadWeatherForCities(
      this.cities
    );
  }
}
