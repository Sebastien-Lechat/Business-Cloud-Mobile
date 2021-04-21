import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { testData, TArticles } from 'src/interfaces/articles-type';
@Component({
  selector: 'app-show-expense',
  templateUrl: './show-expense.page.html',
  styleUrls: ['./show-expense.page.scss'],
})
export class ShowExpensePage implements OnInit {

  constructor(private router: Router, private location: Location) { }

  articles: Array<TArticles> = testData;

  ngOnInit() {
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }

  nagivateBack() {
    this.location.back();
  }

}
