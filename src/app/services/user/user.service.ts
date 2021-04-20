import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  getUsersList() {
    return this.http.get<any>(this.url + `users`);
  }

  getUser(id: string) {
    return this.http.get<any>(this.url + `user/` + id);
  }

}
