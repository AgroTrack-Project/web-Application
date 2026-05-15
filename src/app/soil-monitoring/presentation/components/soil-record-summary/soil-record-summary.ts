import { Component, Input, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SoilMonitoringStore } from '../../../application/soil-monitoring.store';

@Component({
  selector: 'app-soil-record-summary',
  imports: [TranslateModule, DatePipe],
  templateUrl: './soil-record-summary.html',
  styleUrl: './soil-record-summary.css'
})
export class SoilRecordSummary {
  @Input() plotId = '';

  soilStore = inject(SoilMonitoringStore);

  records() {
    return this.soilStore.getRecordsForPlot(this.plotId);
  }

  latestRecord() {
    return this.soilStore.getLatestRecordForPlot(this.plotId);
  }

  statusTranslationKey(): string {
    return this.soilStore.getStatusTranslationKeyForPlot(this.plotId);
  }
}
