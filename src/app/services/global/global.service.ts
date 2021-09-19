import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device, DeviceId } from '@capacitor/device';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  tabsSubject: BehaviorSubject<string> = new BehaviorSubject(undefined);
  closeConv: BehaviorSubject<boolean> = new BehaviorSubject(undefined);

  creationSubject: BehaviorSubject<number> = new BehaviorSubject(6);

  private url = environment.API;
  private deviceInfo: DeviceId;

  constructor(private http: HttpClient) { }

  addFCMDevice(data: { deviceId: string, token: string }) {
    return this.http.put<any>(this.url + `account/register-fcm/`, data);
  }

  registerFCM() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      async (token: Token) => {
        this.deviceInfo = await Device.getId();
        this.addFCMDevice({ token: token.value, deviceId: this.deviceInfo.uuid }).subscribe({
          next: (data: { error: false, message: string }) => {
            console.log(data);
          }
        });
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      () => {
        // notification: PushNotificationSchema
        // alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      () => {
        // notification: ActionPerformed
        // alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  findNextNumber(acronym: string) {
    return this.http.get<any>(this.url + `global/nextNumber?acronym=` + acronym);
  }

  getStatistics() {
    return this.http.get<any>(this.url + `global/statistics`);
  }

  getFileasPDF(type: string, id: string) {
    return this.http.get<any>(this.url + `global/generateInvoice/${type}/${id}`);
  }

}
