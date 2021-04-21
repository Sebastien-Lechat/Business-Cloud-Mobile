import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ExpenseCreateI } from 'src/interfaces/expenseInterface';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  create(data: ExpenseCreateI) {
    return this.http.post<any>(this.url + `expense`, data);
  }
}
