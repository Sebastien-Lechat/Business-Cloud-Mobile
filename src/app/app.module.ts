import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DEFAULT_TIMEOUT, TimeoutInterceptor } from './services/interceptor/http.interceptor';
import { TokenInterceptor } from './services/interceptor/token.interceptor';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
registerLocaleData(localeFr);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgCircleProgressModule.forRoot(),
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyA9Hbp-w13B3gOgCZIjBKF4JHmkTAjXxDI',
      authDomain: 'businesscloud-mobile.firebaseapp.com',
      storageBucket: 'businesscloud-mobile.appspot.com',
      projectId: 'businesscloud-mobile',
    }),
    AngularFireStorageModule
  ],
  providers: [
    ScreenOrientation,
    Device,
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
    { provide: DEFAULT_TIMEOUT, useValue: 30000 },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
