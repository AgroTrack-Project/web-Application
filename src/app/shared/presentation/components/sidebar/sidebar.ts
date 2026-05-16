import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IdentityStore } from '../../../../identity/application/identity.store';
import { EnterprisePlan } from '../../../../identity/domain/model/enterprise-plan.entity';

interface SidebarItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  private readonly identityStore = inject(IdentityStore);

  private readonly baseItems: SidebarItem[] = [
    { label: 'sidebar.start',         icon: 'home',          route: '/home' },
    { label: 'sidebar.plots',         icon: 'agriculture',   route: '/parcelas' },
    { label: 'sidebar.alerts',        icon: 'notifications', route: '/alertas' },
    { label: 'sidebar.dashboard',     icon: 'dashboard',     route: '/dashboard' },
  ];

  readonly menuItems = computed((): SidebarItem[] => {
    const items = [...this.baseItems];
    const plan = this.identityStore.currentUser()?.getPlan();
    if (plan instanceof EnterprisePlan) {
      items.push({ label: 'sidebar.support', icon: 'support_agent', route: '/support' });
    }
    items.push(
      { label: 'sidebar.configuration', icon: 'settings', route: '/configuracion' },
      { label: 'sidebar.profile',       icon: 'person',   route: '/perfil' },
    );
    return items;
  });

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!this.identityStore.users().length) {
      this.identityStore.loadUsers();
    }
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
