import { Component, Input, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { SoilMonitoringStore } from '../../../application/soil-monitoring.store';

@Component({
  selector: 'app-soil-advice-card',
  imports: [TranslateModule],
  templateUrl: './soil-advice-card.html',
  styleUrl: './soil-advice-card.css'
})
export class SoilAdviceCard {
  @Input() plotId = '';

  soilStore = inject(SoilMonitoringStore);

  adviceTranslationKey(): string {
    return this.soilStore.getAdviceTranslationKeyForPlot(this.plotId);
  }

  statusClass(): string {
    return this.soilStore.getStatusClassForPlot(this.plotId);
  }
}
