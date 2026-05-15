import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FarmingStore } from '../../../application/farming.store';
import { Plot } from '../../../domain/model/plot.entity';
import { Crop } from '../../../domain/model/crop.entity';
import { CropStatus } from '../../../domain/model/crop-status.enum';
import { CropCard } from '../../components/crop-card/crop-card';

type Tab = 'crops' | 'soil' | 'irrigation' | 'history';

@Component({
  selector: 'app-plot-detail',
  imports: [CropCard],
  templateUrl: './plot-detail.html',
  styleUrl: './plot-detail.css'
})
export class PlotDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  store = inject(FarmingStore);

  plotId = signal<string>('');
  activeTab = signal<Tab>('crops');

  cropType = signal('');
  cropSowingDate = signal('');

  readonly plot = computed<Plot | undefined>(() =>
    this.store.plots().find(p => p.getId() === this.plotId())
  );

  readonly crops = computed<Crop[]>(() =>
    this.store.getCropsForPlot(this.plotId())
  );

  readonly tabs: { key: Tab; label: string }[] = [
    { key: 'crops',      label: 'Cultivos'  },
    { key: 'soil',       label: 'Suelo'     },
    { key: 'irrigation', label: 'Riego'     },
    { key: 'history',    label: 'Historial' },
  ];

  ngOnInit(): void {
    this.plotId.set(this.route.snapshot.paramMap.get('id') ?? '');
    this.store.loadPlots();
    this.store.loadCrops();
  }

  goBack(): void {
    this.router.navigate(['/parcelas']);
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

  deleteCrop(id: string): void { this.store.deleteCrop(id); }

  onCropTypeInput(e: Event): void { this.cropType.set((e.target as HTMLInputElement).value); }
  onCropSowingDateInput(e: Event): void { this.cropSowingDate.set((e.target as HTMLInputElement).value); }
}
