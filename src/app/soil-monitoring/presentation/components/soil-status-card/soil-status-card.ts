import { Component, Input, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SoilMonitoringStore } from '../../../application/soil-monitoring.store';

@Component({
  selector: 'app-soil-status-card',
  imports: [TranslateModule, DatePipe],
  templateUrl: './soil-status-card.html',
  styleUrl: './soil-status-card.css'
})
export class SoilStatusCard {
  @Input() plotId = '';

  soilStore = inject(SoilMonitoringStore);

  latestRecord() {
    return this.soilStore.getLatestRecordForPlot(this.plotId);
  }

  statusClass(): string {
    return this.soilStore.getStatusClassForPlot(this.plotId);
  }

  statusTranslationKey(): string {
    return this.soilStore.getStatusTranslationKeyForPlot(this.plotId);
  }
}
