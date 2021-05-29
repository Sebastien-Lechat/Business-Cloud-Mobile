import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ClientI } from 'src/interfaces/userInterface';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.API;

  constructor(private http: HttpClient, private accountService: AccountService) { }

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
    return this.http.delete<any>(this.url + `auth/disconnect`);
  }

  /* -------------- Facebook Function -------------- */

  async loginToFacebook(): Promise<{ request: Observable<any>, token: string } | null> {
    const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos'];
    const result = await Plugins.FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    if (result && result.accessToken) {
      return { request: from(Plugins.FacebookLogin.getProfile({ fields: ['email', 'birthday', 'picture.width(500).height(500)', 'name'] }) as Promise<any>), token: 'string' };
    } else {
      return null;
    }
  }

  async logoutFromFacebook(): Promise<void> {
    await Plugins.FacebookLogin.logout();
  }

  /* -------------- Google Function -------------- */

  async loginToGoogle(): Promise<Observable<any>> {
    return from(Plugins.GoogleAuth.signIn(null) as Promise<any>);
  }

  async logoutFromGoogle(): Promise<void> {
    await Plugins.GoogleAuth.signOut(null);
  }

}
