import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-user-expense-list',
  templateUrl: './user-expense-list.component.html',
  styleUrls: ['./user-expense-list.component.scss'],
})
export class UserExpenseListComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() { }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }


}
