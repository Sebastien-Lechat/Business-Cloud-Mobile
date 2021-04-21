import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { TimeProjectComponent } from 'src/app/components/modals/time-project/time-project.component';
import { CalendarProjectComponent } from 'src/app/components/modals/calendar-project/calendar-project.component';

@Component({
  selector: 'app-show-project',
  templateUrl: './show-project.page.html',
  styleUrls: ['./show-project.page.scss'],
})
export class ShowProjectPage implements OnInit {

  constructor(private router: Router, private location: Location, public modalController: ModalController, private routerOutlet: IonRouterOutlet) { }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }

  nagivateBack() {
    this.location.back();
  }

  ngOnInit() {
  }

  async showAddTimeModal() {
    const modal = await this.modalController.create({
      component: TimeProjectComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  async showCalendarModal() {
    const modal = await this.modalController.create({
      component: CalendarProjectComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

}
