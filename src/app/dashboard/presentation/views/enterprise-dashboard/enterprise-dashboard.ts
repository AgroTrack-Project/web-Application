import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IdentityStore } from '../../../../identity/application/identity.store';
import { DashboardStore } from '../../../application/dashboard.store';
import { DashboardService } from '../../../application/dashboard.service';

@Component({
  selector: 'app-enterprise-dashboard',
  imports: [DecimalPipe, RouterLink, TranslateModule],
  templateUrl: './enterprise-dashboard.html',
  styleUrl: './enterprise-dashboard.css',
})
export class EnterpriseDashboard implements OnInit {
  readonly identityStore = inject(IdentityStore);
  readonly store = inject(DashboardStore);
  private readonly dashboardService = inject(DashboardService);

  readonly exporting = signal(false);
  readonly showPdfExport = computed(() => this.identityStore.currentUser()?.getPlan().isExportEnabled() ?? false);
  readonly showExcelExport = computed(() => this.identityStore.currentUser()?.getPlan().isExcelExportEnabled() ?? false);

  private lastLoadedUserId = '';

  constructor() {
    effect(() => {
      const userId = this.identityStore.currentUserId();
      const user = this.identityStore.currentUser();
      if (!user || userId === this.lastLoadedUserId) return;
      this.lastLoadedUserId = userId;
      this.store.load();
    });
  }

  ngOnInit(): void {
    this.identityStore.loadUsers();
  }

  exportPdf(): void {
    if (this.exporting()) return;
    this.exporting.set(true);
    this.dashboardService.exportPDF(this.identityStore.currentUserId()).subscribe({
      complete: () => this.exporting.set(false),
      error: () => this.exporting.set(false),
    });
  }

  exportExcel(): void {
    if (this.exporting()) return;
    this.exporting.set(true);
    this.dashboardService.exportExcel(this.identityStore.currentUserId()).subscribe({
      complete: () => this.exporting.set(false),
      error: () => this.exporting.set(false),
    });
  }
}
