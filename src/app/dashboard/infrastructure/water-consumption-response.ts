import { BaseResource } from '../../shared/infrastructure/base-response';

export interface WaterConsumptionResource extends BaseResource {
  id: string;
  plot_id: string;
  total_liters: number;
  season: string;
  calculated_at?: string;
}
