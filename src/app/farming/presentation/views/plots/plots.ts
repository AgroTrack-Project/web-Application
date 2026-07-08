import { Component, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FarmingStore } from '../../../application/farming.store';
import { IdentityStore } from '../../../../iam/application/identity.store';
import { Plot } from '../../../domain/model/plot.entity';
import { PlotCard } from '../../components/plot-card/plot-card';
import { SoilMonitoringStore } from '../../../../soil-monitoring/application/soil-monitoring.store';

@Component({
  selector: 'app-plots',
  imports: [PlotCard, TranslateModule],
  templateUrl: './plots.html',
  styleUrl: './plots.css'
})
export class Plots implements OnInit {
  store = inject(FarmingStore);
  identityStore = inject(IdentityStore);
  private router = inject(Router);
  soilStore = inject(SoilMonitoringStore);

  readonly planName = computed(() => {
    return this.identityStore.currentPlanType();
  });

  readonly currentUserName = computed(() => this.identityStore.currentUser()?.getName() ?? 'Invitado');

  readonly maxPlots = computed<number | string>(() => {
    const user = this.identityStore.currentUser();
    if (!user) return '—';
    const max = user.getPlan().getMaxPlots();
    return max === Infinity ? '∞' : max;
  });

  ngOnInit(): void {
    this.store.loadPlots();
    this.store.loadCrops();
    this.identityStore.loadUsers();
    this.soilStore.loadSoilRecords();
    this.soilStore.loadIrrigationRecommendations();
  }

  goToPlot(plot: Plot): void {
    this.router.navigate(['/parcelas', plot.getId()]);
  }

  goToNewPlot(): void {
    this.router.navigate(['/parcelas/nueva']);
  }

  goToEditPlot(plot: Plot): void {
    this.router.navigate(['/parcelas', plot.getId(), 'editar']);
  }

  deletePlot(id: string): void {
    this.store.deleteCropsByPlot(id);
    this.soilStore.deleteSoilRecordsByPlot(id);
    this.soilStore.deleteIrrigationRecommendationsByPlot(id);

    this.store.deletePlot(id);
  }
}
