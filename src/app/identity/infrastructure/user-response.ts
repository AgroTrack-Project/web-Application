import {BaseResource} from '../../shared/infrastructure/base-response';

export interface UserResource extends BaseResource {
  id: string;
  name: string;
  email: string;
  password: string;
  user_type: 'farmer' | 'agricultural_manager';
  plan_type: 'BASIC' | 'PRO' | 'ENTERPRISE';
  company_name?: string;
  created_at: string;
  updated_at: string;
}
