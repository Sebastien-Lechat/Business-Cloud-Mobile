import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  getNotificationList() {
    return this.http.get<any>(this.url + `notifications`);
  }

  count() {
    return this.http.get<any>(this.url + `notifications/count`, { headers: new HttpHeaders({ timeout: `${60 * 60000}` }) });
  }

  delete(id: string) {
    return this.http.delete<any>(this.url + `notification/` + id);
  }

}
