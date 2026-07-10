import {
  Component,
  computed,
  effect,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertsStore } from '../../../application/alerts.store';
import { FarmingStore } from '../../../../farming/application/farming.store';
import { IdentityStore } from '../../../../identity/application/identity.store';
import { PlotStatus } from '../../../../farming/domain/model/plot-status.enum';
import { DEPARTMENT_TO_CITY } from '../../../domain/constants/peru-department-city';
import { AlertNotification } from '../../../domain/model/alerts-notification.entity';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
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

  readonly visibleAlerts = computed(() => {
    const pref = this.identityStore.currentAlertPreference();
    if (!pref) return this.store.alerts();

    return this.store.alerts().filter(alert => {
      const title = alert.title.toLowerCase();
      if (title.includes('cold')) return pref.isEnabled('FROST');
      if (title.includes('drought')) return pref.isEnabled('DROUGHT');
      if (title.includes('rain')) return pref.isEnabled('HEAVY_RAIN');
      return true;
    });
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
    this.identityStore.loadAlertPreferences();
  }

  getPlotNames(city: string): string {
    return this.cityToPlotNames().get(city)?.join(', ') ?? city;
  }

  severityClass(alert: AlertNotification): string {
    return alert.severity === 'HIGH' ? 'severity-high' : 'severity-medium';
  }

  alertIcon(alert: AlertNotification): string {
    const title = alert.title.toLowerCase();
    if (title.includes('rain')) return 'water_drop';
    if (title.includes('drought')) return 'wb_sunny';
    if (title.includes('cold')) return 'ac_unit';
    if (title.includes('heat')) return 'thermostat';
    return 'warning';
  }
}
