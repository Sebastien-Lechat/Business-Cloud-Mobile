import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { HistoryI } from 'src/interfaces/globalInterface';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.scss'],
})
export class UserHistoryComponent implements OnInit {

  id: string;
  loading = false;
  history: HistoryI[];

  constructor(
    private modalController: ModalController,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.userService.getUserHistory(this.id).subscribe({
      next: (data: { error: false, history: HistoryI[] }) => {
        data.history.map((item: HistoryI) => {
          item.action.name = this.userService.getActionType(item.action.method, item.action.route);
        });
        this.history = data.history;
        this.loading = false;
      }
    });

  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
