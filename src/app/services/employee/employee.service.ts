import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  create(data: any) {
    return this.http.post<any>(this.url + `employee`, data);
  }
}
