import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { ClientI } from 'src/interfaces/userInterface';
import { UserHistoryComponent } from '../components/modals/user-history/user-history.component';
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
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
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
    localStorage.removeItem('currentUser');
    this.authService.logout().subscribe({
      next: () => {
        this.navigateTo('/auth/login');
      },
      error: () => {
        this.navigateTo('/auth/login');
      },
    });
  }

  async showHistory() {
    const modal = await this.modalController.create({
      component: UserHistoryComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        id: this.user.id,
      }
    });
    return await modal.present();
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }
}
