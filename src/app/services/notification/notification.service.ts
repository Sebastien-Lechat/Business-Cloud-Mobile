import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private url = environment.API;

  headerNotificationsCountAlreadyExist = false;
  intervalCount: any;
  notificationCount = 0;

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

  getNotificationCount() {
    this.count().subscribe({
      next: (data: { error: false, count: number }) => {
        if (data.count > 99) { data.count = 99; }
        this.notificationCount = data.count;
      },
    });
  }

  setNotificationInterval() {
    this.intervalCount = setInterval(() => {
      this.getNotificationCount();
    }, 5000);
  }

  clearNotificationInterval() {
    this.headerNotificationsCountAlreadyExist = false;
    clearInterval(this.intervalCount);
  }

}
