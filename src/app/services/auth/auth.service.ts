import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ClientI } from 'src/interfaces/userInterface';
import { AccountService } from '../account/account.service';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.API;

  constructor(
    private http: HttpClient,
    private accountService: AccountService,
    private notificationService: NotificationService
  ) { }

  register(data: ClientI) {
    return this.http.post<any>(this.url + `auth/register`, data);
  }

  login(email: string, password: string, code?: string) {
    return this.http.post<any>(this.url + `auth/login`, { email, password, code })
      .pipe(
        map(response => {
          if (response.user && response.user.token) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.accountService.setAccountProfile(response.user);
          }
          return response;
        }),
      );
  }

  externalLogin(type: string, id: string, email: string, token: string) {
    return this.http.post<any>(this.url + `auth/external/login`, { type, id, email, token })
      .pipe(
        map(response => {
          if (response.user && response.user.token) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.accountService.setAccountProfile(response.user);
          }
          return response;
        }),
      );
  }

  passwordRecoveryRequest(email: string) {
    return this.http.post(this.url + `auth/request-password-lost`, { email });
  }

  verifyEmailRequest(email: string) {
    return this.http.post<any>(this.url + `auth/request-verify-email`, { email });
  }

  verifyEmail(email: string, code: string) {
    return this.http.post<any>(this.url + `auth/verify-email`, { email, code });
  }

  doubleAuthentificationRequest(email: string, password: string) {
    return this.http.post<any>(this.url + `auth/request-double-auth`, { email, password });
  }


  getToken(): string {
    if (localStorage.getItem('currentUser')) { return JSON.parse(localStorage.getItem('currentUser')); }
    else { return ''; }
  }

  refreshToken() {
    const currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.post<any>(this.url + `auth/refresh-token`, { id: currentUser.id, refresh_token: currentUser.refresh_token })
      .pipe(
        map(response => {
          if (response.user && response.user.token) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
          return response.user.token;
        }),
      );
  }

  logout() {
    this.notificationService.clearNotificationInterval();
    return this.http.delete<any>(this.url + `auth/disconnect`);
  }

  /* -------------- Facebook Function -------------- */

  async logoutFromFacebook(): Promise<void> {
    await FacebookLogin.logout();
  }

  /* -------------- Google Function -------------- */

  async loginToGoogle(): Promise<Observable<any>> {
    return from(GoogleAuth.signIn() as Promise<any>);
  }

  async logoutFromGoogle(): Promise<void> {
    await GoogleAuth.signOut();
  }

}
