import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.page.html',
  styleUrls: ['./add-page.page.scss'],
})
export class AddPagePage implements OnInit {

  selected = '1';

  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
  }

  navigateTo(path: string, id?: string) {
    this.router.navigate([path, id]);
  }

  nagivateBack() {
    this.location.back();
  }


  onSelectedChange($event) {
    this.selected = $event.detail?.value;
  }
}
