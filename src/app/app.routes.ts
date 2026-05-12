import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', children: [] },
  { path: 'parcelas', children: [] },
  { path: 'alertas', children: [] },
  { path: 'configuracion', children: [] },
  { path: 'perfil', children: [] },
];
