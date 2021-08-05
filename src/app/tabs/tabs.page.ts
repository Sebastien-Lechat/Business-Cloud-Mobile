import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Stripe } from '@capacitor-community/stripe';
import { ViewWillEnter } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AccountService } from '../services/account/account.service';
import { GlobalService } from '../services/global/global.service';
import { SocketService } from '../services/global/socket.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy, ViewWillEnter {

  selected: string;
  private stripeKey = environment.STRIPE_KEY;

  constructor(private router: Router, public accountService: AccountService, private socketService: SocketService, private globalService: GlobalService) {
    const url = this.router.routerState.snapshot.url;
    if (url === '/tabs/tab1' || url.includes('/tabs/show-project/')) {
      this.selected = 'projet';
    } else if (url === '/tabs/tab2' || url === '/tabs/add-page' || url.includes('/tabs/show-bill/') || url.includes('/tabs/show-quote/')) {
      this.selected = 'fichier';
    } else if (url === '/tabs/tab3') {
      this.selected = 'accueil';
    } else if (url === '/tabs/tab4' || url.includes('/tabs/user-profile/')) {
      this.selected = 'client';
    } else if (url === '/tabs/tab5' || url === '/tabs/user-info' || url === '/tabs/notifications' || url === '/tabs/user-change-password' || url === '/tabs/user-change-address' || url === '/tabs/user-change-enterprise' || url === '/tabs/') {
      this.selected = 'profil';
    } else if (url === '/tabs/conversations') {
      this.selected = 'message';
    }
  }

  ngOnInit(): void {
    this.globalService.registerFCM();

    this.globalService.tabsSubject.subscribe({
      next: (selected: string) => { if (selected) { this.selected = selected; } }
    });
  }

  ionViewWillEnter(): void {
    this.socketService.connect();
    Stripe.initialize({
      publishableKey: this.stripeKey,
    });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
    this.selected = '';
  }

  selectedTabs(tabs: string) {
    this.selected = tabs;
  }
}
