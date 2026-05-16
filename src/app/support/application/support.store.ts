import { inject, Injectable, signal } from '@angular/core';
import { IdentityStore } from '../../identity/application/identity.store';
import { SupportTicketService } from './support-ticket.service';
import { SupportTicket } from '../domain/model/support-ticket.entity';

@Injectable({ providedIn: 'root' })
export class SupportStore {
  private readonly supportService = inject(SupportTicketService);
  private readonly identityStore = inject(IdentityStore);

  private readonly ticketsSignal = signal<SupportTicket[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly tickets = this.ticketsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  loadTickets(): void {
    const userId = this.identityStore.currentUserId();
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.supportService.getByUser(userId).subscribe({
      next: tickets => {
        this.ticketsSignal.set(tickets);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set('support.errors.load');
        this.loadingSignal.set(false);
      },
    });
  }

  createTicket(
    subject: string,
    message: string,
    onSuccess: (t: SupportTicket) => void,
    onError?: () => void,
  ): void {
    const userId = this.identityStore.currentUserId();
    this.supportService.create(subject, message, userId).subscribe({
      next: created => {
        this.ticketsSignal.update(list => [created, ...list]);
        onSuccess(created);
      },
      error: err => {
        this.errorSignal.set('support.errors.create');
        onError?.();
      },
    });
  }

  closeTicket(ticketId: string, onSuccess: (t: SupportTicket) => void): void {
    this.supportService.close(ticketId).subscribe({
      next: updated => {
        if (!updated) return;
        this.ticketsSignal.update(list => list.map(t => (t.id === updated.id ? updated : t)));
        onSuccess(updated);
      },
      error: err => this.errorSignal.set('support.errors.close'),
    });
  }
}
