import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-add-btn',
  templateUrl: './add-btn.component.html',
  styleUrls: ['./add-btn.component.scss'],
})
export class AddBtnComponent implements OnInit {

  constructor(private router: Router, private globalService: GlobalService) { }

  ngOnInit() {
  }

  navigateTo(path: string) {
    const url = this.router.routerState.snapshot.url;
    if (url === '/tabs/tab1') {
      this.globalService.creationSubject.next(8);
      this.router.navigate([path]);
    }
    else if (url === '/tabs/tab2') {
      this.globalService.creationSubject.next(2);
      this.router.navigate([path]);
    }
    else if (url === '/tabs/tab3') {
      this.globalService.creationSubject.next(2);
      this.router.navigate([path]);
    }
    else if (url === '/tabs/tab4') {
      this.globalService.creationSubject.next(4);
      this.router.navigate([path]);
    }
  }

}
