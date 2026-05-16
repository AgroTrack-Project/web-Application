import { BaseResource } from '../../shared/infrastructure/base-response';

export interface LossSummaryResource extends BaseResource {
  id: string;
  plot_id: string;
  loss_percentage: number;
  cause: string;
  season: string;
  calculated_at?: string;
}
