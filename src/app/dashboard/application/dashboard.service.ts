import { Injectable } from '@angular/core';
import { delay, map, Observable, of, tap } from 'rxjs';
import { IdentityStore } from '../../identity/application/identity.store';
import { DashboardMetricsApi } from '../infrastructure/dashboard-metrics-api';
import { Dashboard } from '../domain/model/dashboard.entity';
import { YieldSummary } from '../domain/model/yield-summary.entity';
import { LossSummary } from '../domain/model/loss-summary.entity';
import { WaterConsumption } from '../domain/model/water-consumption.entity';
import { DashboardAccessDeniedError } from '../domain/error/dashboard-access-denied.error';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(
    private readonly metricsApi: DashboardMetricsApi,
    private readonly identityStore: IdentityStore,
  ) {}

  getDashboard(userId: string): Observable<Dashboard> {
    this.assertDashboardAccess(userId);
    return this.metricsApi.getDashboardForUser(userId);
  }

  getYieldSummaries(userId: string): Observable<YieldSummary[]> {
    return this.getDashboard(userId).pipe(map(d => d.yieldSummaries));
  }

  getLossSummaries(userId: string): Observable<LossSummary[]> {
    return this.getDashboard(userId).pipe(map(d => d.lossSummaries));
  }

  getWaterConsumptions(userId: string): Observable<WaterConsumption[]> {
    return this.getDashboard(userId).pipe(map(d => d.waterConsumptions));
  }

  exportPDF(userId: string): Observable<void> {
    this.assertDashboardAccess(userId);
    return of(undefined).pipe(
      delay(400),
      tap(() => console.info(`[AgroTrack] Exportación PDF — usuario ${userId}`)),
    );
  }

  exportExcel(userId: string): Observable<void> {
    this.assertDashboardAccess(userId);
    const user = this.identityStore.getUserById(userId);
    if (!user?.getPlan().isExcelExportEnabled()) {
      throw new DashboardAccessDeniedError('La exportación Excel requiere plan Enterprise.');
    }
    return of(undefined).pipe(
      delay(400),
      tap(() => console.info(`[AgroTrack] Exportación Excel — usuario ${userId}`)),
    );
  }

  private assertDashboardAccess(userId: string): void {
    const user = this.identityStore.getUserById(userId);
    if (!user?.getPlan().isDashboardEnabled()) {
      throw new DashboardAccessDeniedError();
    }
  }
}
