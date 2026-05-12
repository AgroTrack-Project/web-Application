import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  menuItems = [
    { label: 'Inicio',        icon: 'dashboard',  route: '/home' },
    { label: 'Parcelas',      icon: 'agriculture', route: '/parcelas' },
    { label: 'Alertas',       icon: 'notifications', route: '/alertas' },
    { label: 'Configuración', icon: 'settings', route: '/configuracion' },
    { label: 'Perfil',        icon: 'person', route: '/perfil' },
  ];

  constructor(private router: Router) {}

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
