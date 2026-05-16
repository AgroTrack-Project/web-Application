import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FarmingStore } from '../../../../farming/application/farming.store';
import { IdentityStore } from '../../../../identity/application/identity.store';
import { AlertsStore } from '../../../../alerts/application/alerts.store';
import { PlotStatus } from '../../../../farming/domain/model/plot-status.enum';
import { DEPARTMENT_TO_CITY } from '../../../../alerts/domain/constants/peru-department-city';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private farmingStore  = inject(FarmingStore);
  private identityStore = inject(IdentityStore);
  private alertsStore   = inject(AlertsStore);
  private router        = inject(Router);

  readonly username = computed(() => this.identityStore.currentUser()?.getName() ?? '');

  readonly plots = computed(() => {
    const userId = this.identityStore.currentUserId();
    return this.farmingStore.plots().filter(
      p => p.getUserId() === userId && p.getStatus() !== PlotStatus.DELETED
    );
  });

  readonly plotCount    = computed(() => this.plots().length);
  readonly criticalCount = computed(() => this.alertsStore.alerts().length);

  constructor() {
    effect(() => {
      const cities = [...new Set(
        this.plots().map(p => DEPARTMENT_TO_CITY[p.getLocation()] ?? p.getLocation())
      )];
      this.alertsStore.loadWeatherForCities(cities);
    });
  }

  ngOnInit(): void {
    this.farmingStore.loadPlots();
    this.farmingStore.loadCrops();
    this.identityStore.loadUsers();
  }

  getFirstCropType(plotId: string): string {
    const crops = this.farmingStore.getCropsForPlot(plotId);
    const active = crops.find(c => c.isActive());
    return active?.getType() ?? '—';
  }

  goToNewPlot(): void {
    this.router.navigate(['/parcelas/nueva']);
  }
}
