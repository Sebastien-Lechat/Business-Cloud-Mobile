import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() { }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
