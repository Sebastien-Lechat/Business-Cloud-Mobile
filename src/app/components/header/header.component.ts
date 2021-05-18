import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global/global.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  notificationCount = 0;

  intervalCount: any;

  constructor(private router: Router, private notificationService: NotificationService, private globalService: GlobalService) { }

  ngOnInit() {
    if (!this.globalService.headerNotificationsCountAlreadyExist) {
      this.globalService.headerNotificationsCountAlreadyExist = true;
      this.intervalCount = setInterval(() => {
        this.getNotificationCount();
      }, 7000);
    }
  }

  getNotificationCount() {
    this.notificationService.count().subscribe({
      next: (data: { error: false, count: number }) => {
        if (data.count > 99) { data.count = 99; }
        this.notificationCount = data.count;
      },
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  ngOnDestroy(): void {
    this.globalService.headerNotificationsCountAlreadyExist = false;
    clearInterval(this.intervalCount);
  }

}
