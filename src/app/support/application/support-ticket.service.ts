import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpSupportTicketRepository } from '../infrastructure/http-support-ticket.repository';
import { SupportTicket } from '../domain/model/support-ticket.entity';
import { TicketStatus } from '../domain/model/ticket-status.enum';

@Injectable({ providedIn: 'root' })
export class SupportTicketService {
  constructor(private readonly repository: HttpSupportTicketRepository) {}

  create(subject: string, message: string, userId: string): Observable<SupportTicket> {
    const ticket = new SupportTicket(
      '',
      userId,
      subject.trim(),
      message.trim(),
      TicketStatus.OPEN,
      new Date(),
      null,
    );
    return this.repository.save(ticket);
  }

  close(ticketId: string): Observable<SupportTicket | undefined> {
    return new Observable(observer => {
      this.repository.findById(ticketId).subscribe({
        next: ticket => {
          if (!ticket) {
            observer.next(undefined);
            observer.complete();
            return;
          }
          const status = ticket.getStatus();
          if (status !== TicketStatus.OPEN && status !== TicketStatus.IN_PROGRESS) {
            observer.next(ticket);
            observer.complete();
            return;
          }
          ticket.close();
          this.repository.save(ticket).subscribe({
            next: updated => {
              observer.next(updated);
              observer.complete();
            },
            error: err => observer.error(err),
          });
        },
        error: err => observer.error(err),
      });
    });
  }

  getByUser(userId: string): Observable<SupportTicket[]> {
    return this.repository.findByUserId(userId);
  }

  getById(ticketId: string): Observable<SupportTicket | undefined> {
    return this.repository.findById(ticketId);
  }
}
