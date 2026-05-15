import { BaseResource } from '../../shared/infrastructure/base-response';

export interface PlotResource extends BaseResource {
  id: string;
  name: string;
  location: string;
  size_hectares: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  user_id: string;
  created_at: string;
}
