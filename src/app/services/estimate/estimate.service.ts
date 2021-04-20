import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstimateService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  getEstimateList() {
    return this.http.get<any>(this.url + `estimates`);
  }
}
