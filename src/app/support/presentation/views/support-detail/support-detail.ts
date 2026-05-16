import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IdentityStore } from '../../../../identity/application/identity.store';
import { SupportTicketService } from '../../../application/support-ticket.service';
import { SupportTicket } from '../../../domain/model/support-ticket.entity';
import { TicketStatus } from '../../../domain/model/ticket-status.enum';

@Component({
  selector: 'app-support-detail',
  imports: [DatePipe, RouterLink, TranslateModule],
  templateUrl: './support-detail.html',
  styleUrl: './support-detail.css',
})
export class SupportDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly identityStore = inject(IdentityStore);
  private readonly supportService = inject(SupportTicketService);

  readonly TicketStatus = TicketStatus;
  private readonly ticketSignal = signal<SupportTicket | null>(null);
  readonly ticket = this.ticketSignal.asReadonly();
  readonly loading = signal(true);

  readonly canClose = computed(() => {
    const t = this.ticketSignal();
    if (!t) return false;
    const s = t.getStatus();
    return s === TicketStatus.OPEN || s === TicketStatus.IN_PROGRESS;
  });

  ngOnInit(): void {
    this.identityStore.loadUsers();
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      void this.router.navigate(['/support']);
      return;
    }
    this.supportService.getById(id).subscribe({
      next: t => {
        const userId = this.identityStore.currentUserId();
        if (!t || t.userId !== userId) {
          void this.router.navigate(['/support']);
          return;
        }
        this.ticketSignal.set(t);
        this.loading.set(false);
      },
      error: () => {
        void this.router.navigate(['/support']);
      },
    });
  }

  closeTicket(): void {
    const t = this.ticketSignal();
    if (!t) return;
    this.supportService.close(t.id).subscribe({
      next: updated => this.ticketSignal.set(updated ?? t),
    });
  }
}
