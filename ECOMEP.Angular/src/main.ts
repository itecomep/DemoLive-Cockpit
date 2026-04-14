import { AppInjector } from './app/app-injector';
import { AppComponent } from './app/app.component';
// import { NgChartsModule } from 'ng2-charts';
import { MaterialImportModule } from './app/material-import/material-import.module';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Meta, BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AzureBlobUploadInterceptor } from './app/helpers/azure.blob.upload.interceptor';
import { ManageHttpInterceptor } from './app/helpers/managehttp.interceptor';
import { GetLoaderInterceptor } from './app/helpers/get.loader.interceptor';
import { LoaderInterceptor } from './app/helpers/loader.interceptor';
import { ErrorInterceptor } from './app/helpers/error.interceptor';
import { TokenInterceptor } from './app/helpers/token.interceptor';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { LOCALE_ID, isDevMode, importProvidersFrom } from '@angular/core';
import { DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { AppPermissions } from './app/app.permissions';
import { AppConfig } from './app/app.config';
import { provideRouter, withHashLocation, withRouterConfig } from '@angular/router';
import { ROOT_ROUTES } from './app/app.routes';
// import { OtpInputKeysPipe } from './app/mcv-otp-input/pipes/otp-input-keys.pipe';
import { registerLocaleData } from '@angular/common';
import localeIN from '@angular/common/locales/en-IN';
import { OtpInputKeysPipe } from './app/auth/mcv-otp-input/pipes/otp-input-keys.pipe';
import { FullCalendarModule } from '@fullcalendar/angular';
registerLocaleData(localeIN);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(ROOT_ROUTES, withHashLocation(), withRouterConfig({ onSameUrlNavigation: 'reload' })),
    importProvidersFrom(BrowserModule,FullCalendarModule, ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }), MaterialImportModule),
    AppConfig,
    AppPermissions,
    DatePipe,
    DecimalPipe,
    CurrencyPipe,
    OtpInputKeysPipe,
    { provide: LOCALE_ID, useValue: 'en-IN' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: GetLoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ManageHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AzureBlobUploadInterceptor, multi: true },
    Meta,
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi())
  ]
})
  .then((moduleRef) =>
  {
    AppInjector.setInjector(moduleRef.injector);
  })
  .catch(err => console.log(err));
