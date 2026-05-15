import { Component, Input, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SoilMonitoringStore } from '../../../application/soil-monitoring.store';
import { IrrigationRecommendationStatus } from '../../../domain/model/irrigation-recommendation-status.enum';

@Component({
  selector: 'app-soil-advice-card',
  imports: [TranslateModule],
  templateUrl: './soil-advice-card.html',
  styleUrl: './soil-advice-card.css'
})
export class SoilAdviceCard {
  @Input() plotId = '';

  soilStore = inject(SoilMonitoringStore);
  private translate = inject(TranslateService);

  pendingRecommendation() {
    return this.soilStore.getPendingRecommendationForPlot(this.plotId);
  }

  latestRecord() {
    return this.soilStore.getLatestRecordForPlot(this.plotId);
  }

  adviceTranslationKey(): string {
    return this.soilStore.getAdviceTranslationKeyForPlot(this.plotId);
  }

  statusClass(): string {
    return this.soilStore.getStatusClassForPlot(this.plotId);
  }

  adviceMessage(): string {
    const pending = this.pendingRecommendation();

    if (pending) {
      return pending.getMessage();
    }

    return this.translate.instant(this.adviceTranslationKey());
  }

  confirmRecommendation(): void {
    const pending = this.pendingRecommendation();

    if (pending) {
      this.soilStore.confirmRecommendation(pending);
      return;
    }

    this.createDecision(IrrigationRecommendationStatus.CONFIRMED);
  }

  rejectRecommendation(): void {
    const pending = this.pendingRecommendation();

    if (pending) {
      this.soilStore.rejectRecommendation(pending);
      return;
    }

    this.createDecision(IrrigationRecommendationStatus.REJECTED);
  }

  private createDecision(status: IrrigationRecommendationStatus): void {
    const latestRecord = this.latestRecord();

    if (!latestRecord) {
      return;
    }

    this.soilStore.createIrrigationDecision(
      this.plotId,
      latestRecord.getId(),
      this.adviceMessage(),
      this.soilStore.getUrgencyForPlot(this.plotId),
      status
    );
  }
}
