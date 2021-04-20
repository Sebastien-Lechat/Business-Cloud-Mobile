import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TArticles, testData } from 'src/interfaces/articles-type';

@Component({
  selector: 'app-show-quote',
  templateUrl: './show-quote.page.html',
  styleUrls: ['./show-quote.page.scss'],
})
export class ShowQuotePage implements OnInit {

  articles: Array<TArticles> = testData;

  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
  }

  navigateTo(path: string, id?: string) {
    this.router.navigate([path, id]);
  }

  nagivateBack() {
    this.location.back();
  }

}
