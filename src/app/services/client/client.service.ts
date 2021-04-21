import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClientCreateI } from 'src/interfaces/userInterface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  create(data: ClientCreateI) {
    return this.http.post<any>(this.url + `customer`, data);
  }
}
