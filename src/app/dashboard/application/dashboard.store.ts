import { inject, Injectable, signal } from '@angular/core';
import { IdentityStore } from '../../identity/application/identity.store';
import { DashboardService } from './dashboard.service';
import { Dashboard } from '../domain/model/dashboard.entity';
import { DashboardAccessDeniedError } from '../domain/error/dashboard-access-denied.error';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly dashboardService = inject(DashboardService);
  private readonly identityStore = inject(IdentityStore);

  private readonly dashboardSignal = signal<Dashboard | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly accessDeniedSignal = signal(false);

  readonly dashboard = this.dashboardSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly accessDenied = this.accessDeniedSignal.asReadonly();

  load(): void {
    const userId = this.identityStore.currentUserId();
    const user = this.identityStore.currentUser();
    if (!user) {
      this.errorSignal.set('dashboard.errors.no_session');
      return;
    }
    if (!user.getPlan().isDashboardEnabled()) {
      this.accessDeniedSignal.set(true);
      this.dashboardSignal.set(null);
      return;
    }

    this.accessDeniedSignal.set(false);
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.dashboardService.getDashboard(userId).subscribe({
      next: dash => {
        this.dashboardSignal.set(dash);
        this.loadingSignal.set(false);
      },
      error: err => {
        if (err instanceof DashboardAccessDeniedError) {
          this.accessDeniedSignal.set(true);
        } else {
          this.errorSignal.set('dashboard.errors.load');
        }
        this.loadingSignal.set(false);
      },
    });
  }
}
