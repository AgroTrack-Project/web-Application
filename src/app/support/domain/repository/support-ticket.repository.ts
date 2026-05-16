import { Observable } from 'rxjs';
import { SupportTicket } from '../model/support-ticket.entity';

export abstract class SupportTicketRepository {
  abstract findByUserId(userId: string): Observable<SupportTicket[]>;
  abstract findById(id: string): Observable<SupportTicket | undefined>;
  abstract save(ticket: SupportTicket): Observable<SupportTicket>;
}
