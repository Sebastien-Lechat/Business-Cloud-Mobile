import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  getBillList() {
    return this.http.get<any>(this.url + `bills`);
  }
}
