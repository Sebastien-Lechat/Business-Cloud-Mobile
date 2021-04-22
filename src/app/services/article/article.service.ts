import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ArticleCreateI } from 'src/interfaces/articleInterface';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  getArticleList() {
    return this.http.get<any>(this.url + `articles`);
  }

  create(data: ArticleCreateI) {
    return this.http.post<any>(this.url + `article`, data);
  }
}
