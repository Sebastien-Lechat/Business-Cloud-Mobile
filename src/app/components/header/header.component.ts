import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
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
export class HeaderComponent implements OnInit {

  user: UserI;
  avatar = '';
  avatarLoaded = false;


  @Input() headerText: string;

  constructor(
    private router: Router,
    public notificationService: NotificationService,
    private globalService: GlobalService,
    private accountService: AccountService,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit() {
    if (!this.notificationService.headerNotificationsCountAlreadyExist) {
      this.notificationService.headerNotificationsCountAlreadyExist = true;
      this.notificationService.getNotificationCount();
      this.notificationService.setNotificationInterval();
    }
    this.user = this.accountService.user;
    this.loadImg(this.user.avatar);
  }

  loadImg(path: string) {
    const ref = this.afStorage.ref('images/' + path);
    ref.getDownloadURL().subscribe({
      next: (data: any) => {
        this.avatar = data;
        this.avatarLoaded = true;
      },
      error: () => {
        this.avatarLoaded = true;
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  navigateToProfile(path: string) {
    this.router.navigate([path]);
    this.globalService.tabsSubject.next('profil');
  }

}
