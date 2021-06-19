import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-private-policy',
  templateUrl: './private-policy.component.html',
  styleUrls: ['./private-policy.component.scss'],
})
export class PrivatePolicyComponent implements OnInit {

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() { }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
