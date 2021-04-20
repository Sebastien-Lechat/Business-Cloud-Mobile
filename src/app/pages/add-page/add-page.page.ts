import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.page.html',
  styleUrls: ['./add-page.page.scss'],
})
export class AddPagePage implements OnInit {

  selected: string;

  subscribeCreate: Subscription;

  constructor(private router: Router, private globalService: GlobalService) { }

  ngOnInit() {
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
    this.router.navigate([path, id]);
  }

  onSelectedChange($event) {
    this.selected = $event.detail?.value;
  }


}
