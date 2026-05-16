import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { Home } from './shared/presentation/views/home/home';
import { Profile } from './identity/presentation/views/profile/profile';
import { Configuration } from './identity/presentation/views/configuration/configuration';
import { AlertsPageComponent } from './alerts/presentation/components/alerts-page/alerts-page';
import { Plots } from './farming/presentation/views/plots/plots';
import { PlotDetail } from './farming/presentation/views/plot-detail/plot-detail';
import { PlotForm } from './farming/presentation/views/plot-form/plot-form';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'home', component: Home },
      {
        path: 'alertas',
        component: AlertsPageComponent
      },
      { path: 'parcelas', component: Plots },
      { path: 'parcelas/nueva', component: PlotForm },
      { path: 'parcelas/:id/editar', component: PlotForm },
      { path: 'parcelas/:id', component: PlotDetail },
      { path: 'dashboard', children: [] },
      { path: 'configuracion', component: Configuration },
      { path: 'perfil', component: Profile },
    ]
  }
];
