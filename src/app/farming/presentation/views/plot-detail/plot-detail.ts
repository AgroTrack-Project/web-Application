import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FarmingStore } from '../../../application/farming.store';
import { Plot } from '../../../domain/model/plot.entity';
import { Crop } from '../../../domain/model/crop.entity';
import { CropStatus } from '../../../domain/model/crop-status.enum';
import { CropCard } from '../../components/crop-card/crop-card';

import { SoilMonitoringStore } from '../../../../soil-monitoring/application/soil-monitoring.store';
import { SoilStatusCard } from '../../../../soil-monitoring/presentation/components/soil-status-card/soil-status-card';
import { SoilAdviceCard } from '../../../../soil-monitoring/presentation/components/soil-advice-card/soil-advice-card';
import { SoilRecordSummary } from '../../../../soil-monitoring/presentation/components/soil-record-summary/soil-record-summary';
import { IrrigationSummary } from '../../../../soil-monitoring/presentation/components/irrigation-summary/irrigation-summary';


type Tab = 'crops' | 'soil' | 'irrigation' | 'history';

@Component({
  selector: 'app-plot-detail',
  imports: [CropCard, TranslateModule, SoilStatusCard, SoilAdviceCard, SoilRecordSummary, IrrigationSummary],
  templateUrl: './plot-detail.html',
  styleUrl: './plot-detail.css'
})
export class PlotDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  store = inject(FarmingStore);
  soilStore = inject(SoilMonitoringStore);

  plotId = signal<string>('');
  activeTab = signal<Tab>('crops');

  cropType = signal('');
  cropSowingDate = signal('');
  editingCrop = signal<Crop | null>(null);
  showEditCropModal = signal(false);
  editCropType = signal('');
  editCropSowingDate = signal('');

  readonly plot = computed<Plot | undefined>(() =>
    this.store.plots().find(p => p.getId() === this.plotId())
  );

  readonly crops = computed<Crop[]>(() =>
    this.store.getCropsForPlot(this.plotId())
  );

  readonly activeCrops = computed<Crop[]>(() =>
    this.crops().filter(crop => crop.getStatus() !== CropStatus.HARVESTED)
  );

  readonly harvestedCrops = computed<Crop[]>(() =>
    this.crops().filter(crop => crop.getStatus() === CropStatus.HARVESTED)
  );

  readonly activeCropSowingDate = computed<string | null>(() => {
    const activeCrop = this.activeCrops()[0];

    return activeCrop
      ? activeCrop.getSowingDate().toISOString()
      : null;
  });

  readonly tabs: { key: Tab; labelKey: string }[] = [
    { key: 'crops', labelKey: 'plot_detail.tabs.crops' },
    { key: 'soil', labelKey: 'plot_detail.tabs.soil' },
    { key: 'irrigation', labelKey: 'plot_detail.tabs.irrigation' },
    { key: 'history', labelKey: 'plot_detail.tabs.history' },
  ];

  ngOnInit(): void {
    this.plotId.set(this.route.snapshot.paramMap.get('id') ?? '');
    this.store.loadPlots();
    this.store.loadCrops();
    this.soilStore.loadSoilRecords();
    this.soilStore.loadIrrigationRecommendations();
  }

  goBack(): void {
    this.router.navigate(['/parcelas']);
  }

  goToEditCurrentPlot(): void {
    this.router.navigate(['/parcelas', this.plotId(), 'editar']);
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  addCrop(): void {
    if (!this.cropType().trim() || !this.cropSowingDate()) return;

    const crop = new Crop(
      crypto.randomUUID(),
      this.cropType().trim(),
      this.cropSowingDate(),
      '',
      CropStatus.ACTIVE,
      this.plotId()
    );

    this.store.createCrop(crop);
    this.cropType.set('');
    this.cropSowingDate.set('');
  }

  deleteCrop(id: string): void {
    this.store.deleteCrop(id);
  }

  openEditCrop(crop: Crop): void {
    this.editingCrop.set(crop);
    this.editCropType.set(crop.getType());
    this.editCropSowingDate.set(crop.getSowingDate().toISOString().split('T')[0]);
    this.showEditCropModal.set(true);
  }

  closeEditCropModal(): void {
    this.showEditCropModal.set(false);
    this.editingCrop.set(null);
    this.editCropType.set('');
    this.editCropSowingDate.set('');
  }

  saveEditCrop(): void {
    const crop = this.editingCrop();

    if (!crop || !this.editCropType().trim() || !this.editCropSowingDate()) {
      return;
    }

    const harvestDate = crop.getHarvestDate()?.toISOString().split('T')[0] ?? '';

    crop.update(
      this.editCropType().trim(),
      this.editCropSowingDate(),
      harvestDate
    );

    this.store.updateCrop(crop);
    this.closeEditCropModal();
  }

  harvestCrop(id: string): void {
    const crop = this.store.getCropsForPlot(this.plotId())
      .find(item => item.getId() === id);

    if (!crop) {
      return;
    }

    crop.markAsHarvested(new Date().toISOString().split('T')[0]);
    this.store.updateCrop(crop);
  }

  onEditCropTypeInput(event: Event): void {
    this.editCropType.set((event.target as HTMLInputElement).value);
  }

  onEditCropSowingDateInput(event: Event): void {
    this.editCropSowingDate.set((event.target as HTMLInputElement).value);
  }

  deleteCurrentPlot(): void {
    const id = this.plotId();

    this.store.deleteCropsByPlot(id);
    this.soilStore.deleteSoilRecordsByPlot(id);
    this.soilStore.deleteIrrigationRecommendationsByPlot(id);

    this.store.deletePlot(id);
    this.router.navigate(['/parcelas']);
  }

  onCropTypeInput(e: Event): void {
    this.cropType.set((e.target as HTMLInputElement).value);
  }

  onCropSowingDateInput(e: Event): void {
    this.cropSowingDate.set((e.target as HTMLInputElement).value);
  }
}
