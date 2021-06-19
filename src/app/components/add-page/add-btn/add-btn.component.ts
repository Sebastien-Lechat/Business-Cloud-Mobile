import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global/global.service';
import { StartConversationComponent } from '../../modals/start-conversation/start-conversation.component';

@Component({
  selector: 'app-add-btn',
  templateUrl: './add-btn.component.html',
  styleUrls: ['./add-btn.component.scss'],
})
export class AddBtnComponent implements OnInit {

  constructor(
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private router: Router,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
  }

  async navigateTo(path: string) {
    const url = this.router.routerState.snapshot.url;
    if (url === '/tabs/tab1') {
      this.globalService.creationSubject.next(8);
      this.router.navigate([path]);
    } else if (url === '/tabs/tab2') {
      this.globalService.creationSubject.next(2);
      this.router.navigate([path]);
    } else if (url === '/tabs/tab3') {
      this.globalService.creationSubject.next(2);
      this.router.navigate([path]);
    } else if (url === '/tabs/tab4') {
      this.globalService.creationSubject.next(4);
      this.router.navigate([path]);
    } else if (url === '/tabs/conversations') {
      const modal = await this.modalController.create({
        component: StartConversationComponent,
        swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl
      });
      return await modal.present();
    }
  }

}
