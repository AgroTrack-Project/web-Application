import { APP_INITIALIZER, ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideTranslateService, TranslateService} from '@ngx-translate/core';
import {provideHttpClient} from '@angular/common/http';
import { SupportTicketRepository } from './support/domain/repository/support-ticket.repository';
import { HttpSupportTicketRepository } from './support/infrastructure/http-support-ticket.repository';

function initDefaultLanguage(): () => Promise<void> {
  const translate = inject(TranslateService);
  return () => {
    translate.setDefaultLang('en');
    translate.use('en');
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: SupportTicketRepository, useExisting: HttpSupportTicketRepository },
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),
    { provide: APP_INITIALIZER, useFactory: initDefaultLanguage, multi: true },
  ]
};
