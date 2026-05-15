import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { Home } from './shared/presentation/views/home/home';
import { Profile } from './identity/presentation/views/profile/profile';
import { Configuration } from './identity/presentation/views/configuration/configuration';
import { Plots } from './farming/presentation/views/plots/plots';
import { PlotDetail } from './farming/presentation/views/plot-detail/plot-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'home', component: Home },
      { path: 'parcelas', component: Plots },
      { path: 'parcelas/:id', component: PlotDetail },
      { path: 'alertas', children: [] },
      { path: 'dashboard', children: [] },
      { path: 'configuracion', component: Configuration },
      { path: 'perfil', component: Profile },
    ]
  }
];
