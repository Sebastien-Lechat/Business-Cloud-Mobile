import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { DeviceInfo, Plugins, PushNotification, PushNotificationActionPerformed, PushNotificationToken } from '@capacitor/core';
const { PushNotifications, Device } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  creationSubject: BehaviorSubject<number> = new BehaviorSubject(6);
  headerNotificationsCountAlreadyExist = false;

  private url = environment.API;
  private deviceInfo: DeviceInfo;

  constructor(private http: HttpClient) { }

  addFCMDevice(data: { deviceId: string, token: string }) {
    return this.http.put<any>(this.url + `account/register-fcm/`, data);
  }

  registerFCM() {
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      async (token: PushNotificationToken) => {
        this.deviceInfo = await Device.getInfo();
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
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

}
