import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { NotificationJsonI } from 'src/interfaces/notificationInterface';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications: NotificationJsonI[] = [];

  constructor(private router: Router, private location: Location, private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.getNotificationList().subscribe({
      next: (data: { error: false, notifications: NotificationJsonI[] }) => {
        this.notifications = data.notifications;
        console.log(this.notifications);
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  nagivateBack() {
    this.location.back();
  }

}


// function secondsToDhms(seconds) {
//   seconds = Number(seconds);
//   var d = Math.floor(seconds / (3600*24));
//   var h = Math.floor(seconds % (3600*24) / 3600);
//   var m = Math.floor(seconds % 3600 / 60);
//   var s = Math.floor(seconds % 60);

//   var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
//   var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
//   var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
//   var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
//   return dDisplay + hDisplay + mDisplay + sDisplay;
//   }
