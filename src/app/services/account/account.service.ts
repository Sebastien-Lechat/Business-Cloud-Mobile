import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ClientI, UserDoubleAuthUpdateI, UserInfoUpdateI, UserPasswordUpdateI } from 'src/interfaces/userInterface';
import { map } from 'rxjs/operators';
import { AddressUpdateI, EnterpriseUpdateI } from 'src/interfaces/enterpriseInterface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private url = environment.API;
  public user: ClientI;
  public type: 'user' | 'client';
  public role: 'Gérant' | string;

  constructor(private http: HttpClient) {
    if (localStorage.getItem('currentUser')) {
      this.setAccountProfile(JSON.parse(localStorage.getItem('currentUser')));
    }
  }

  setAccountProfile(user: ClientI) {
    this.user = user;
    this.type = user.type;
    this.role = user.role;
  }

  getAccountProfile() {
    return this.http.get<any>(this.url + `account`)
      .pipe(
        map(response => {
          if (response.user && response.user.token) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.setAccountProfile(response.user);
          }
          return response;
        }),
      );
  }

  modifyUserInfo(toUpdate: UserInfoUpdateI) {
    return this.http.put<any>(this.url + `account/information`, toUpdate);
  }

  modifyUserPassword(toUpdate: UserPasswordUpdateI) {
    return this.http.put<any>(this.url + `account/password`, toUpdate);
  }

  modifyUserEnterprise(toUpdate: EnterpriseUpdateI) {
    return this.http.put<any>(this.url + `account/enterprise`, toUpdate);
  }

  modifyUserAddress(toUpdate: AddressUpdateI) {
    return this.http.put<any>(this.url + `account/address`, toUpdate);
  }

  modifyUserDoubleAuth(toUpdate: UserDoubleAuthUpdateI) {
    return this.http.post<any>(this.url + `auth/activate-double-auth`, toUpdate);
  }
}
