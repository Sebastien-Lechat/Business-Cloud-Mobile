import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPage implements OnInit {

  loading = false;

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
