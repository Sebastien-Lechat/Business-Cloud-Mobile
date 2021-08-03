import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserI } from 'src/interfaces/userInterface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: UserI;
  notificationCount = 0;
  intervalCount: any;

  @Input() headerText: string;

  constructor(private router: Router, private notificationService: NotificationService, private globalService: GlobalService, private accountService: AccountService) { }

  ngOnInit() {
    if (!this.globalService.headerNotificationsCountAlreadyExist) {
      this.globalService.headerNotificationsCountAlreadyExist = true;
      this.getNotificationCount();
      this.intervalCount = setInterval(() => {
        this.getNotificationCount();
      }, 5000);
    }
    this.user = this.accountService.user;
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

  navigateToProfile(path: string) {
    this.router.navigate([path]);
    this.globalService.tabsSubject.next('profil');
  }

  ngOnDestroy(): void {
    this.globalService.headerNotificationsCountAlreadyExist = false;
    clearInterval(this.intervalCount);
  }

}
