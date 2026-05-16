import { BaseResource } from '../../shared/infrastructure/base-response';

export interface IrrigationRecommendationResource extends BaseResource {
  id: string;
  plot_id: string;
  soil_record_id: string;
  message: string;
  urgency: string;
  status: string;
  generated_at: string;
  responded_at: string | null;
}
