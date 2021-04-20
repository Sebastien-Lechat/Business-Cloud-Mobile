import { Component } from '@angular/core';
import { AccountService } from '../services/account/account.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  selected: string;

  constructor(public accountService: AccountService) {
    if (window.location.href?.split('http://localhost:8100/tabs/')[1]) {
      const url = window.location.href.split('http://localhost:8100/tabs/')[1];
      if (url === 'tab1') {
        this.selected = 'projet';
      } else if (url === 'tab2') {
        this.selected = 'fichier';
      } else if (url === 'tab3') {
        this.selected = 'accueil';
      } else if (url === 'tab4') {
        this.selected = 'client';
      } else if (url === 'tab5') {
        this.selected = 'profil';
      }
    }
  }

  selectedTabs(tabs: string) {
    this.selected = tabs;
  }
}
