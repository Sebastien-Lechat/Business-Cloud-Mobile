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
        data.notifications.map((notification: NotificationJsonI) => {
          notification.createdAt = this.formatCreatedAt(notification.createdAt as string);
        });
        this.notifications = data.notifications;
      }
    });
  }

  navigateTo(category: string, id: string) {
    if (category === 'Facture') { this.router.navigate(['/tabs/show-bill/', id]); }
    if (category === 'Projet') { this.router.navigate(['/tabs/show-project/', id]); }
    if (category === 'Devis') { this.router.navigate(['/tabs/show-quote/', id]); }
    if (category === 'Message') { this.router.navigate(['/messages/', id]); }
  }

  nagivateBack() {
    this.location.back();
  }

  formatCreatedAt(date: string): string {
    const s = (Date.now() - new Date(date).getTime()) / 1000;
    const day = Math.floor(s / (3600 * 24));
    const hours = Math.floor(s % (3600 * 24) / 3600);
    const minutes = Math.floor(s % 3600 / 60);
    const seconds = Math.floor(s % 60);
    return (day) ? day + 'j' : (hours) ? hours + 'h' : (minutes) ? minutes + 'm' : seconds + 's';
  }
}

