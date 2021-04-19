import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-change-enterprise',
  templateUrl: './user-change-enterprise.page.html',
  styleUrls: ['./user-change-enterprise.page.scss'],
})
export class UserChangeEnterprisePage implements OnInit {

  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
  }

  navigateTo(path: string) {
    this.router.navigate([path])
  }

  nagivateBack() {
    this.location.back()
  }


}
