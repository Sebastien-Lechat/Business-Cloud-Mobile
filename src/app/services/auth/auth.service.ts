import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public url = 'https://businesscloud-api.herokuapp.com/';

  constructor(private http: HttpClient) { }

  login(email: string, password: string, code?: string) {
    return this.http.post<any>(this.url + `auth/login`, { email, password, code })
      .pipe(
        map(response => {
          if (response.user && response.user.token) { localStorage.setItem('currentUser', JSON.stringify(response.user)); }
          return response;
        }),
      );
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

  logout() {
    localStorage.removeItem('currentUser');
    return this.http.delete<any>(this.url + `auth/disconnect`);
  }

}
