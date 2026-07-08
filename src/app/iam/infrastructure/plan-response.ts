import {BaseResource} from '../../shared/infrastructure/base-response';

export interface PlanResource extends BaseResource {
  id: string;
  plan_type: 'BASIC' | 'PRO' | 'ENTERPRISE';
  price: number;
  max_plots: number;
  is_dashboard_enabled: boolean;
  is_export_enabled: boolean;
  has_priority_support: boolean;
}
