import { BaseResource } from '../../shared/infrastructure/base-response';

export interface AlertPreferenceResource extends BaseResource {
  id: string;
  user_id: string;
  frost_enabled: boolean;
  drought_enabled: boolean;
  heavy_rain_enabled: boolean;
}
