import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FarmingStore } from '../../../application/farming.store';
import { IdentityStore } from '../../../../identity/application/identity.store';
import { Plot } from '../../../domain/model/plot.entity';
import { PlotStatus } from '../../../domain/model/plot-status.enum';
import { PlotCard } from '../../components/plot-card/plot-card';
import { ProPlan } from '../../../../identity/domain/model/pro-plan.entity';
import { EnterprisePlan } from '../../../../identity/domain/model/enterprise-plan.entity';

const PERU_DEPARTMENTS = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho',
  'Cajamarca', 'Callao', 'Cusco', 'Huancavelica', 'Huánuco',
  'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima',
  'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura',
  'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
];

@Component({
  selector: 'app-plots',
  imports: [PlotCard, TranslatePipe],
  templateUrl: './plots.html',
  styleUrl: './plots.css'
})
export class Plots implements OnInit {
  store = inject(FarmingStore);
  identityStore = inject(IdentityStore);
  private router = inject(Router);

  readonly departments = PERU_DEPARTMENTS;

  showPlotModal = signal(false);
  editingPlot = signal<Plot | null>(null);
  plotId = signal('');
  plotName = signal('');
  plotLocation = signal(PERU_DEPARTMENTS[0]);
  plotSizeHectares = signal(0);
  plotStatus = signal<PlotStatus>(PlotStatus.ACTIVE);

  readonly PlotStatus = PlotStatus;

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
    this.identityStore.loadUsers();
  }

  goToPlot(plot: Plot): void {
    this.router.navigate(['/parcelas', plot.getId()]);
  }

  openAddPlotModal(): void {
    this.editingPlot.set(null);
    this.plotId.set(crypto.randomUUID());
    this.plotName.set('');
    this.plotLocation.set(PERU_DEPARTMENTS[0]);
    this.plotSizeHectares.set(0);
    this.plotStatus.set(PlotStatus.ACTIVE);
    this.showPlotModal.set(true);
  }

  openEditPlotModal(plot: Plot): void {
    this.editingPlot.set(plot);
    this.plotId.set(plot.getId());
    this.plotName.set(plot.getName());
    this.plotLocation.set(plot.getLocation());
    this.plotSizeHectares.set(plot.getSizeHectares());
    this.plotStatus.set(plot.getStatus());
    this.showPlotModal.set(true);
  }

  closePlotModal(): void { this.showPlotModal.set(false); }

  savePlot(): void {
    const existing = this.editingPlot();
    if (existing) {
      existing.update(this.plotName(), this.plotLocation(), this.plotSizeHectares());
      existing.setStatus(this.plotStatus());
      this.store.updatePlot(existing);
    } else {
      const plot = new Plot(
        this.plotId(),
        this.plotName(),
        this.plotLocation(),
        this.plotSizeHectares(),
        PlotStatus.ACTIVE,
        '1',
        new Date().toISOString()
      );
      this.store.createPlot(plot);
    }
    this.showPlotModal.set(false);
  }

  deletePlot(id: string): void {
    this.store.deletePlot(id);
  }

  onPlotNameInput(e: Event): void { this.plotName.set((e.target as HTMLInputElement).value); }
  onPlotLocationChange(e: Event): void { this.plotLocation.set((e.target as HTMLSelectElement).value); }
  onPlotSizeInput(e: Event): void { this.plotSizeHectares.set(+(e.target as HTMLInputElement).value); }
  onPlotStatusChange(e: Event): void { this.plotStatus.set((e.target as HTMLSelectElement).value as PlotStatus); }
}
