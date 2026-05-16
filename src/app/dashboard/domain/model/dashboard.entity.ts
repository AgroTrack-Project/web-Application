import { YieldSummary } from './yield-summary.entity';
import { LossSummary } from './loss-summary.entity';
import { WaterConsumption } from './water-consumption.entity';

export class Dashboard {
  constructor(
    readonly yieldSummaries: YieldSummary[],
    readonly lossSummaries: LossSummary[],
    readonly waterConsumptions: WaterConsumption[],
    readonly userPlotCount: number,
  ) {}

  hasPlots(): boolean {
    return this.userPlotCount > 0;
  }

  hasMetrics(): boolean {
    return (
      this.yieldSummaries.length > 0 ||
      this.lossSummaries.length > 0 ||
      this.waterConsumptions.length > 0
    );
  }
}
