import { BaseResource } from '../../shared/infrastructure/base-response';

export interface CropResource extends BaseResource {
  id: string;
  type: string;
  sowing_date: string;
  harvest_date: string;
  status: 'ACTIVE' | 'HARVESTED' | 'LOST';
  plot_id: string;
}
