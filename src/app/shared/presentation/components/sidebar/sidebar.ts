import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  menuItems = [
    { label: 'sidebar.start',         icon: 'home',          route: '/home' },
    { label: 'sidebar.plots',         icon: 'agriculture',   route: '/parcelas' },
    { label: 'sidebar.alerts',        icon: 'notifications', route: '/alertas' },
    { label: 'sidebar.dashboard',     icon: 'dashboard',     route: '/dashboard' },
    { label: 'sidebar.configuration', icon: 'settings',      route: '/configuracion' },
    { label: 'sidebar.profile',       icon: 'person',        route: '/perfil' },
  ];

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
