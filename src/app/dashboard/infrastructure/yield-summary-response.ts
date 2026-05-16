import { BaseResource } from '../../shared/infrastructure/base-response';

export interface YieldSummaryResource extends BaseResource {
  id: string;
  plot_id: string;
  yield_per_hectare: number;
  season: string;
  calculated_at?: string;
}
