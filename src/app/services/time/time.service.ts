import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TimeCreateI } from 'src/interfaces/timeInterface';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  getTimeList(projectId: string) {
    return this.http.get<any>(this.url + `times/` + projectId);
  }

  create(data: TimeCreateI) {
    return this.http.post<any>(this.url + `time`, data);
  }

  update(data: { id: string, billable: boolean }) {
    return this.http.put<any>(this.url + `time`, data);
  }

  delete(id: string) {
    return this.http.delete<any>(this.url + `time/` + id);
  }

}
