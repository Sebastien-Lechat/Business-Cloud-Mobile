import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BillCreateI } from 'src/interfaces/billInterface';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  getBillList() {
    return this.http.get<any>(this.url + `bills`);
  }

  create(data: BillCreateI) {
    return this.http.post<any>(this.url + `bill`, data);
  }
}
