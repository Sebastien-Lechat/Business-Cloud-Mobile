import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DEFAULT_TIMEOUT, TimeoutInterceptor } from './services/interceptor/http.interceptor';
import { TokenInterceptor } from './services/interceptor/token.interceptor';

registerLocaleData(localeFr);
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule, HttpClientModule],
  providers: [
    ScreenOrientation,
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
    { provide: DEFAULT_TIMEOUT, useValue: 30000 },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
