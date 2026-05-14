import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { Home } from './shared/presentation/views/home/home';
import { Profile } from './identity/presentation/views/profile/profile';
import { Configuration } from './identity/presentation/views/configuration/configuration';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'home', component: Home },
      { path: 'parcelas', children: [] },
      { path: 'alertas', children: [] },
      { path: 'dashboard', children: [] },
      { path: 'configuracion', component: Configuration },
      { path: 'perfil', component: Profile },
    ]
  }
];
