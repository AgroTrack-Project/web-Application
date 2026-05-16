import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { IdentityStore } from '../../../../identity/application/identity.store';
import { SupportStore } from '../../../application/support.store';
import { TicketStatus } from '../../../domain/model/ticket-status.enum';

@Component({
  selector: 'app-support-list',
  imports: [DatePipe, RouterLink, TranslateModule],
  templateUrl: './support-list.html',
  styleUrl: './support-list.css',
})
export class SupportList implements OnInit {
  readonly identityStore = inject(IdentityStore);
  readonly store = inject(SupportStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly TicketStatus = TicketStatus;
  readonly hasTickets = computed(() => this.store.tickets().length > 0);

  ngOnInit(): void {
    this.identityStore.loadUsers();
    this.store.loadTickets();
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(e => {
        if (e.urlAfterRedirects.split('?')[0] === '/support') {
          this.store.loadTickets();
        }
      });
  }
}
