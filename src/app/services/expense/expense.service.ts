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

  getExpenseList(projectId: string) {
    return this.http.get<any>(this.url + `expenses/` + projectId);
  }

  getOneExpense(id: string) {
    return this.http.get<any>(this.url + `expense/` + id);
  }

  create(data: ExpenseCreateI) {
    return this.http.post<any>(this.url + `expense`, data);
  }

  update(data: { id: string, billable: boolean }) {
    return this.http.put<any>(this.url + `expense`, data);
  }

  delete(id: string) {
    return this.http.delete<any>(this.url + `expense/` + id);
  }
}
