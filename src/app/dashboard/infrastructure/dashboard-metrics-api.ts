import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlotRefDto } from './plot-ref.dto';
import { YieldSummaryResource } from './yield-summary-response';
import { LossSummaryResource } from './loss-summary-response';
import { WaterConsumptionResource } from './water-consumption-response';
import { Dashboard } from '../domain/model/dashboard.entity';
import { YieldSummary } from '../domain/model/yield-summary.entity';
import { LossSummary } from '../domain/model/loss-summary.entity';
import { WaterConsumption } from '../domain/model/water-consumption.entity';

@Injectable({ providedIn: 'root' })
export class DashboardMetricsApi {
  private readonly base = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getDashboardForUser(userId: string): Observable<Dashboard> {
    return forkJoin({
      plots: this.http.get<PlotRefDto[]>(`${this.base}${environment.plotsEndpointPath}`),
      yields: this.http.get<YieldSummaryResource[]>(`${this.base}${environment.yieldSummariesEndpointPath}`),
      losses: this.http.get<LossSummaryResource[]>(`${this.base}${environment.lossSummariesEndpointPath}`),
      waters: this.http.get<WaterConsumptionResource[]>(`${this.base}${environment.waterConsumptionsEndpointPath}`),
    }).pipe(
      map(({ plots, yields, losses, waters }) => {
        const userPlots = plots.filter(p => String(p.user_id) === String(userId) && p.status !== 'DELETED');
        const plotIds = new Set(userPlots.map(p => String(p.id)));
        const names = new Map(userPlots.map(p => [String(p.id), p.name]));
        const nameOf = (plotId: string) => names.get(String(plotId)) ?? `Parcela ${plotId}`;

        const yieldSummaries = yields
          .filter(y => plotIds.has(String(y.plot_id)))
          .map(y => new YieldSummary(String(y.plot_id), nameOf(y.plot_id), y.yield_per_hectare, y.season));

        const lossSummaries = losses
          .filter(l => plotIds.has(String(l.plot_id)))
          .map(l => new LossSummary(String(l.plot_id), nameOf(l.plot_id), l.loss_percentage, l.cause, l.season));

        const waterConsumptions = waters
          .filter(w => plotIds.has(String(w.plot_id)))
          .map(w => new WaterConsumption(String(w.plot_id), nameOf(w.plot_id), w.total_liters, w.season));

        return new Dashboard(yieldSummaries, lossSummaries, waterConsumptions, userPlots.length);
      }),
    );
  }
}
