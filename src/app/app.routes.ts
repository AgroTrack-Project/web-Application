import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'home', children: [] },
      { path: 'parcelas', children: [] },
      { path: 'alertas', children: [] },
      { path: 'configuracion', children: [] },
      { path: 'perfil', children: [] },
    ]
  }
];
