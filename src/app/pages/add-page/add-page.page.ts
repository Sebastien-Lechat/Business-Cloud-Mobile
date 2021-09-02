import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.page.html',
  styleUrls: ['./add-page.page.scss'],
})
export class AddPagePage implements OnInit {

  selected: string;
  subscribeCreate: Subscription;

  expenseProjectId: string;

  constructor(
    private router: Router,
    private globalService: GlobalService,
    public accountService: AccountService,
  ) { }

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras?.state?.projectId) {
      this.expenseProjectId = this.router.getCurrentNavigation().extras.state.projectId;
    }
  }

  ionViewWillEnter() {
    this.subscribeCreate = this.globalService.creationSubject.subscribe({
      next: (index: number) => this.selected = index.toString(),
    });
  }

  ionViewWillLeave() {
    this.selected = undefined;
    this.subscribeCreate.unsubscribe();
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }

  onSelectedChange($event) {
    this.selected = $event.detail?.value;
  }


}
