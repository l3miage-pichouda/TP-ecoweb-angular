import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  PreloadAllModules,
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
  withPreloading,
} from '@angular/router';

import { provideComponentStore } from '@ngrx/component-store';
import { routes } from './app.routes';
import { apiPrefixInterceptor, authInterceptor } from './shared/interceptors';
import { noCacheInterceptor } from './shared/interceptors/no-cache.interceptor';
import { TitleStrategyService } from './shared/services';
import { AuthStore } from './shared/store';
import { createInjectionToken } from './shared/utils';

export interface EnvironmentConfig {
  apiUrl: string;
}

export const [injectEnvironmentConfig, provideEnvironmentConfig] =
  createInjectionToken<EnvironmentConfig>('EnvironmentConfig');

export const initAppConfig = (config: EnvironmentConfig): ApplicationConfig => {
  return {
    providers: [
      {
        provide: TitleStrategy,
        useClass: TitleStrategyService,
      },
      provideComponentStore(AuthStore),
      provideRouter(
        routes,
        withComponentInputBinding(),
        withHashLocation(),
        withPreloading(PreloadAllModules)
      ),
      provideEnvironmentConfig(config),
      provideHttpClient(
        withInterceptors([
          apiPrefixInterceptor,
          authInterceptor,
          noCacheInterceptor,
        ])
      ),
    ],
  };
};
