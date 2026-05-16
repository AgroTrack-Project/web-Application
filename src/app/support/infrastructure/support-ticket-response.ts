import { BaseResource } from '../../shared/infrastructure/base-response';

export interface SupportTicketResource extends BaseResource {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  responded_at: string | null;
}
