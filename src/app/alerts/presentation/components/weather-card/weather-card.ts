import {
  Component,
  computed,
  effect,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { AlertsStore } from '../../../application/alerts.store';
import { FarmingStore } from '../../../../farming/application/farming.store';
import { IdentityStore } from '../../../../identity/application/identity.store';
import { PlotStatus } from '../../../../farming/domain/model/plot-status.enum';
import { DEPARTMENT_TO_CITY } from '../../../domain/constants/peru-department-city';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-card.html',
  styleUrls: ['./weather-card.css']
})
export class WeatherCardComponent implements OnInit {

  store          = inject(AlertsStore);
  farmingStore   = inject(FarmingStore);
  identityStore  = inject(IdentityStore);

  readonly userPlots = computed(() => {
    const userId = this.identityStore.currentUserId();
    return this.farmingStore.plots().filter(
      p => p.getUserId() === userId && p.getStatus() !== PlotStatus.DELETED
    );
  });

  readonly cityToPlotNames = computed(() => {
    const map = new Map<string, string[]>();
    for (const plot of this.userPlots()) {
      const city = DEPARTMENT_TO_CITY[plot.getLocation()] ?? plot.getLocation();
      if (!map.has(city)) map.set(city, []);
      map.get(city)!.push(plot.getName());
    }
    return map;
  });

  constructor() {
    effect(() => {
      const cities = [...this.cityToPlotNames().keys()];
      this.store.loadWeatherForCities(cities);
    });
  }

  ngOnInit(): void {
    this.farmingStore.loadPlots();
    this.identityStore.loadUsers();
  }

  getPlotNames(city: string): string {
    return this.cityToPlotNames().get(city)?.join(', ') ?? city;
  }
}
