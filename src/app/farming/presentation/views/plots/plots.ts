import { Component, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FarmingStore } from '../../../application/farming.store';
import { IdentityStore } from '../../../../identity/application/identity.store';
import { Plot } from '../../../domain/model/plot.entity';
import { PlotCard } from '../../components/plot-card/plot-card';
import { ProPlan } from '../../../../identity/domain/model/pro-plan.entity';
import { EnterprisePlan } from '../../../../identity/domain/model/enterprise-plan.entity';

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

  readonly planName = computed(() => {
    const user = this.identityStore.currentUser();
    if (!user) return 'BASIC';
    if (user.getPlan() instanceof EnterprisePlan) return 'ENTERPRISE';
    if (user.getPlan() instanceof ProPlan) return 'PRO';
    return 'BASIC';
  });

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
    this.store.deletePlot(id);
  }
}
