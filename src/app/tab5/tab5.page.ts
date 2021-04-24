import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientI } from 'src/interfaces/userInterface';
import { AccountService } from '../services/account/account.service';
import { AuthService } from '../services/auth/auth.service';
import { SocketService } from '../services/global/socket.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  user: ClientI = this.accountService.user;

  constructor(
    private router: Router,
    private authService: AuthService,
    private accountService: AccountService,
    private socketService: SocketService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.initData();
  }

  initData() {
    this.accountService.getAccountProfile().subscribe({
      next: (data: { error: false, user: ClientI }) => {
        this.user = data.user;
      },
    });
  }

  logout() {
    this.socketService.disconnect();
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('currentUser');
        this.navigateTo('/auth/login');
      },
      error: () => {
        localStorage.removeItem('currentUser');
        this.navigateTo('/auth/login');
      },
    });
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }
}
