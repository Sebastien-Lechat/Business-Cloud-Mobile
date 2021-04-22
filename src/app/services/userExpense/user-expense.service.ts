import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserExpenseCreateI } from 'src/interfaces/userExpense';

@Injectable({
  providedIn: 'root'
})
export class UserExpenseService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  getOneUserExpense(id: string) {
    return this.http.get<any>(this.url + `expense-employee/` + id);
  }

  create(data: UserExpenseCreateI) {
    return this.http.post<any>(this.url + `expense-employee`, data);
  }
}
