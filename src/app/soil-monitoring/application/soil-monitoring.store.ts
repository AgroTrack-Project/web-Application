import { computed, inject, Injectable, signal } from '@angular/core';
import { SoilMonitoringApi } from '../infrastructure/soil-monitoring-api';
import { SoilRecord } from '../domain/model/soil-record.entity';
import { SoilStatus } from '../domain/model/soil-status.enum';

@Injectable({ providedIn: 'root' })
export class SoilMonitoringStore {
  private soilMonitoringApi = inject(SoilMonitoringApi);

  private soilRecordsSignal = signal<SoilRecord[]>([]);
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
}
