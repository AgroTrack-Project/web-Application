import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { Home } from './shared/presentation/views/home/home';
import { Profile } from './identity/presentation/views/profile/profile';
import { Configuration } from './identity/presentation/views/configuration/configuration';
import { AlertsPageComponent } from './alerts/presentation/components/alerts-page/alerts-page';
import { Plots } from './farming/presentation/views/plots/plots';
import { PlotDetail } from './farming/presentation/views/plot-detail/plot-detail';
import { PlotForm } from './farming/presentation/views/plot-form/plot-form';
import { EnterpriseDashboard } from './dashboard/presentation/views/enterprise-dashboard/enterprise-dashboard';
import { SupportList } from './support/presentation/views/support-list/support-list';
import { SupportNew } from './support/presentation/views/support-new/support-new';
import { SupportDetail } from './support/presentation/views/support-detail/support-detail';

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
      { path: 'dashboard', component: EnterpriseDashboard },
      { path: 'support', component: SupportList },
      { path: 'support/new', component: SupportNew },
      { path: 'support/:id', component: SupportDetail },
      { path: 'configuracion', component: Configuration },
      { path: 'perfil', component: Profile },
    ]
  }
];
