import { BaseResource } from '../../shared/infrastructure/base-response';

export interface SoilRecordResource extends BaseResource {
  id: string;
  plot_id: string;
  humidity: number;
  temperature: number;
  recorded_at: string;
}
