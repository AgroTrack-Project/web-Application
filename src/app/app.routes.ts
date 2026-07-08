import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { Home } from './shared/presentation/views/home/home';
import { Profile } from './iam/presentation/views/profile/profile';
import { Configuration } from './iam/presentation/views/configuration/configuration';
import { AlertsPageComponent } from './alerts/presentation/components/alerts-page/alerts-page';
import { Plots } from './farming/presentation/views/plots/plots';
import { PlotDetail } from './farming/presentation/views/plot-detail/plot-detail';
import { PlotForm } from './farming/presentation/views/plot-form/plot-form';
import { Auth } from './iam/presentation/views/auth/auth';

export const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: Auth, data: { mode: 'sign-in' } },
  { path: 'reset-password', component: Auth, data: { mode: 'reset-password' } },
  { path: 'create-acount-basic', component: Auth, data: { mode: 'create-account', plan: 'BASIC' } },
  { path: 'create-acount-pro', component: Auth, data: { mode: 'create-account', plan: 'PRO' } },
  { path: 'create-acount-enterprise', component: Auth, data: { mode: 'create-account', plan: 'ENTERPRISE' } },
  { path: 'create-account/basic', redirectTo: 'create-acount-basic' },
  { path: 'create-account/pro', redirectTo: 'create-acount-pro' },
  { path: 'create-account/enterprise', redirectTo: 'create-acount-enterprise' },
  {
    path: '',
    component: Layout,
    children: [
      { path: 'home', component: Home },
      { path: 'parcelas', children: [] },
      {
        path: 'alertas',
        component: AlertsPageComponent
      },
      { path: 'parcelas', component: Plots },
      { path: 'parcelas/nueva', component: PlotForm },
      { path: 'parcelas/:id/editar', component: PlotForm },
      { path: 'parcelas/:id', component: PlotDetail },
      { path: 'alertas', children: [] },
      { path: 'dashboard', children: [] },
      { path: 'configuracion', component: Configuration },
      { path: 'perfil', component: Profile },
    ]
  }
];
