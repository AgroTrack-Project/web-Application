import { computed, inject, Injectable, signal } from '@angular/core';
import { FarmingApi } from '../infrastructure/farming-api';
import { Plot } from '../domain/model/plot.entity';
import { Crop } from '../domain/model/crop.entity';
import { PlotStatus } from '../domain/model/plot-status.enum';

@Injectable({ providedIn: 'root' })
export class FarmingStore {
  private farmingApi = inject(FarmingApi);

  private plotsSignal = signal<Plot[]>([]);
  private cropsSignal = signal<Crop[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly plots = this.plotsSignal.asReadonly();
  readonly crops = this.cropsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly activePlots = computed(() =>
    this.plotsSignal().filter(p => p.getStatus() !== PlotStatus.DELETED)
  );

  readonly userPlots = computed(() =>
    this.plotsSignal().filter(p => p.getStatus() !== PlotStatus.DELETED)
  );

  loadPlots(): void {
    this.loadingSignal.set(true);
    this.farmingApi.plots.getAll().subscribe({
      next: plots => {
        this.plotsSignal.set(plots);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err.message);
        this.loadingSignal.set(false);
      }
    });
  }

  loadCrops(): void {
    this.farmingApi.crops.getAll().subscribe({
      next: crops => this.cropsSignal.set(crops),
      error: err => this.errorSignal.set(err.message)
    });
  }

  createPlot(plot: Plot): void {
    this.farmingApi.plots.create(plot).subscribe({
      next: created => this.plotsSignal.update(plots => [...plots, created]),
      error: err => this.errorSignal.set(err.message)
    });
  }

  updatePlot(plot: Plot): void {
    this.farmingApi.plots.update(plot, plot.getId()).subscribe({
      next: updated => this.plotsSignal.update(plots =>
        plots.map(p => p.getId() === updated.getId() ? updated : p)
      ),
      error: err => this.errorSignal.set(err.message)
    });
  }

  deletePlot(id: string): void {
    this.farmingApi.plots.delete(id).subscribe({
      next: () => this.plotsSignal.update(plots => plots.filter(p => p.getId() !== id)),
      error: err => this.errorSignal.set(err.message)
    });
  }

  deleteCropsByPlot(plotId: string): void {
    const cropsToDelete = this.getCropsForPlot(plotId);

    cropsToDelete.forEach(crop => {
      this.farmingApi.crops.delete(crop.getId()).subscribe({
        next: () => this.cropsSignal.update(crops =>
          crops.filter(item => item.getId() !== crop.getId())
        ),
        error: err => this.errorSignal.set(err.message)
      });
    });
  }

  createCrop(crop: Crop): void {
    this.farmingApi.crops.create(crop).subscribe({
      next: created => this.cropsSignal.update(crops => [...crops, created]),
      error: err => this.errorSignal.set(err.message)
    });
  }

  updateCrop(crop: Crop): void {
    this.farmingApi.crops.update(crop, crop.getId()).subscribe({
      next: updated => this.cropsSignal.update(crops =>
        crops.map(c => c.getId() === updated.getId() ? updated : c)
      ),
      error: err => this.errorSignal.set(err.message)
    });
  }

  deleteCrop(id: string): void {
    this.farmingApi.crops.delete(id).subscribe({
      next: () => this.cropsSignal.update(crops => crops.filter(c => c.getId() !== id)),
      error: err => this.errorSignal.set(err.message)
    });
  }

  getCropsForPlot(plotId: string): Crop[] {
    return this.cropsSignal().filter(c => c.getPlotId() === plotId);
  }
  getPlotById(id: string): Plot | undefined {
    return this.plotsSignal().find(plot => plot.getId() === id);
  }

  getActiveUserPlotsCount(userId: string): number {
    return this.plotsSignal().filter(
      plot => plot.getUserId() === userId && plot.getStatus() !== PlotStatus.DELETED
    ).length;
  }
}
