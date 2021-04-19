import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { testData, TArticles } from 'src/interfaces/articles-type';

@Component({
  selector: 'app-show-bill',
  templateUrl: './show-bill.page.html',
  styleUrls: ['./show-bill.page.scss'],
})
export class ShowBillPage implements OnInit {

  constructor(private router: Router, private location: Location) { }

  articles: Array<TArticles> = testData;

  ngOnInit() {
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  nagivateBack() {
    this.location.back();
  }

}
