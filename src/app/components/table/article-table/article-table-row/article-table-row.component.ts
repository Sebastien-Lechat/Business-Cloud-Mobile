import { Component, Input, OnInit } from '@angular/core';
import { TArticles } from 'src/interfaces/articles-type';

@Component({
  selector: 'app-article-table-row',
  templateUrl: './article-table-row.component.html',
  styleUrls: ['./article-table-row.component.scss'],
})
export class ArticleTableRowComponent implements OnInit {

  @Input() row: TArticles;

  constructor() { }

  ngOnInit() { }

}
