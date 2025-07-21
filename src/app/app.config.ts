import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './_core/interceptors/errors.interceptor';
import { authInterceptor } from './_core/interceptors/auth-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes), 
     
     provideClientHydration(withEventReplay()),
     provideHttpClient(withFetch(), withInterceptors([errorInterceptor, authInterceptor])), provideAnimations(), provideNzI18n(es_ES) 
    ]
};