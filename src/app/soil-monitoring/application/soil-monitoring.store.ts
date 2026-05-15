import { computed, inject, Injectable, signal } from '@angular/core';
import { SoilMonitoringApi } from '../infrastructure/soil-monitoring-api';
import { SoilRecord } from '../domain/model/soil-record.entity';
import { SoilStatus } from '../domain/model/soil-status.enum';
import { IrrigationRecommendation } from '../domain/model/irrigation-recommendation.entity';
import { IrrigationRecommendationStatus } from '../domain/model/irrigation-recommendation-status.enum';

@Injectable({ providedIn: 'root' })
export class SoilMonitoringStore {
  private soilMonitoringApi = inject(SoilMonitoringApi);

  private soilRecordsSignal = signal<SoilRecord[]>([]);
  private irrigationRecommendationsSignal = signal<IrrigationRecommendation[]>([]);
  readonly irrigationRecommendations = this.irrigationRecommendationsSignal.asReadonly();
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly soilRecords = this.soilRecordsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly recordsCount = computed(() => this.soilRecordsSignal().length);

  loadSoilRecords(): void {
    this.loadingSignal.set(true);

    this.soilMonitoringApi.soilRecords.getAll().subscribe({
      next: records => {
        this.soilRecordsSignal.set(records);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err.message);
        this.loadingSignal.set(false);
      }
    });
  }

  loadIrrigationRecommendations(): void {
    this.soilMonitoringApi.irrigationRecommendations.getAll().subscribe({
      next: recommendations => this.irrigationRecommendationsSignal.set(recommendations),
      error: err => this.errorSignal.set(err.message)
    });
  }

  createSoilRecord(soilRecord: SoilRecord): void {
    this.soilMonitoringApi.soilRecords.create(soilRecord).subscribe({
      next: created => this.soilRecordsSignal.update(records => [...records, created]),
      error: err => this.errorSignal.set(err.message)
    });
  }

  createIrrigationDecision(
    plotId: string,
    soilRecordId: string,
    message: string,
    urgency: string,
    status: IrrigationRecommendationStatus
  ): void {
    const recommendation = new IrrigationRecommendation(
      crypto.randomUUID(),
      plotId,
      soilRecordId,
      message,
      urgency,
      status,
      new Date().toISOString(),
      new Date().toISOString()
    );

    this.soilMonitoringApi.irrigationRecommendations.create(recommendation).subscribe({
      next: created => this.irrigationRecommendationsSignal.update(recommendations => [
        created,
        ...recommendations
      ]),
      error: err => this.errorSignal.set(err.message)
    });
  }

  getUrgencyForPlot(plotId: string): string {
    const status = this.getSoilStatusForPlot(plotId);

    switch (status) {
      case SoilStatus.DRY:
        return 'HIGH';
      case SoilStatus.WET:
        return 'MEDIUM';
      case SoilStatus.OPTIMAL:
        return 'LOW';
      default:
        return 'LOW';
    }
  }

  getRecordsForPlot(plotId: string): SoilRecord[] {
    return this.soilRecordsSignal()
      .filter(record => record.getPlotId() === plotId)
      .sort((a, b) => b.getRecordedAt().getTime() - a.getRecordedAt().getTime());
  }

  getLatestRecordForPlot(plotId: string): SoilRecord | undefined {
    return this.getRecordsForPlot(plotId)[0];
  }

  getSoilStatusForPlot(plotId: string): SoilStatus {
    const latestRecord = this.getLatestRecordForPlot(plotId);

    if (!latestRecord) {
      return SoilStatus.UNKNOWN;
    }

    return latestRecord.getStatus();
  }

  getStatusTranslationKeyForPlot(plotId: string): string {
    const status = this.getSoilStatusForPlot(plotId);

    switch (status) {
      case SoilStatus.DRY:
        return 'soil.status.dry';
      case SoilStatus.OPTIMAL:
        return 'soil.status.optimal';
      case SoilStatus.WET:
        return 'soil.status.wet';
      default:
        return 'soil.status.unknown';
    }
  }

  getAdviceTranslationKeyForPlot(plotId: string): string {
    const status = this.getSoilStatusForPlot(plotId);

    switch (status) {
      case SoilStatus.DRY:
        return 'soil.advice.dry';
      case SoilStatus.OPTIMAL:
        return 'soil.advice.optimal';
      case SoilStatus.WET:
        return 'soil.advice.wet';
      default:
        return 'soil.advice.unknown';
    }
  }

  getStatusClassForPlot(plotId: string): string {
    const status = this.getSoilStatusForPlot(plotId);

    switch (status) {
      case SoilStatus.DRY:
        return 'status-dry';
      case SoilStatus.OPTIMAL:
        return 'status-optimal';
      case SoilStatus.WET:
        return 'status-wet';
      default:
        return 'status-unknown';
    }
  }

  getRecommendationsForPlot(plotId: string): IrrigationRecommendation[] {
    return this.irrigationRecommendationsSignal()
      .filter(recommendation => recommendation.getPlotId() === plotId)
      .sort((a, b) => b.getGeneratedAt().getTime() - a.getGeneratedAt().getTime());
  }

  getIrrigationHistoryForPlot(plotId: string): IrrigationRecommendation[] {
    return this.getRecommendationsForPlot(plotId)
      .filter(recommendation =>
        recommendation.getStatus() === IrrigationRecommendationStatus.CONFIRMED ||
        recommendation.getStatus() === IrrigationRecommendationStatus.REJECTED
      );
  }

  getIrrigationStatusTranslationKey(recommendation: IrrigationRecommendation): string {
    switch (recommendation.getStatus()) {
      case IrrigationRecommendationStatus.CONFIRMED:
        return 'soil.irrigation.status.applied';
      case IrrigationRecommendationStatus.REJECTED:
        return 'soil.irrigation.status.not_applied';
      default:
        return 'soil.irrigation.status.pending';
    }
  }

  getIrrigationStatusClass(recommendation: IrrigationRecommendation): string {
    switch (recommendation.getStatus()) {
      case IrrigationRecommendationStatus.CONFIRMED:
        return 'status-applied';
      case IrrigationRecommendationStatus.REJECTED:
        return 'status-not-applied';
      default:
        return 'status-pending';
    }
  }

  getPendingRecommendationForPlot(plotId: string): IrrigationRecommendation | undefined {
    return this.getRecommendationsForPlot(plotId)
      .find(recommendation => recommendation.getStatus() === IrrigationRecommendationStatus.PENDING);
  }

  confirmRecommendation(recommendation: IrrigationRecommendation): void {
    recommendation.confirm();

    this.soilMonitoringApi.irrigationRecommendations.update(
      recommendation,
      recommendation.getId()
    ).subscribe({
      next: updated => this.irrigationRecommendationsSignal.update(recommendations =>
        recommendations.map(item => item.getId() === updated.getId() ? updated : item)
      ),
      error: err => this.errorSignal.set(err.message)
    });
  }

  rejectRecommendation(recommendation: IrrigationRecommendation): void {
    recommendation.reject();

    this.soilMonitoringApi.irrigationRecommendations.update(
      recommendation,
      recommendation.getId()
    ).subscribe({
      next: updated => this.irrigationRecommendationsSignal.update(recommendations =>
        recommendations.map(item => item.getId() === updated.getId() ? updated : item)
      ),
      error: err => this.errorSignal.set(err.message)
    });
  }
}
