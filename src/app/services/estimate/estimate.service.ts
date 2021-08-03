import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { EstimateCreateI, EstimateUpdateI } from 'src/interfaces/estimateInterface';

@Injectable({
  providedIn: 'root'
})
export class EstimateService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  getEstimateList() {
    return this.http.get<any>(this.url + `estimates`);
  }

  getOneEstimate(id: string) {
    return this.http.get<any>(this.url + `estimate/` + id);
  }

  create(data: EstimateCreateI) {
    return this.http.post<any>(this.url + `estimate`, data);
  }

  transform(id: string) {
    return this.http.post<any>(this.url + `estimate/transform/${id}`, {});
  }

  update(data: EstimateUpdateI) {
    return this.http.put<any>(this.url + `estimate`, data);
  }

  delete(id: string) {
    return this.http.delete<any>(this.url + `estimate/` + id);
  }

  sendMail(estimateId: string, clientId: string) {
    return this.http.post<any>(this.url + `estimate/` + estimateId + `/customer/` + clientId + `/mail`, {});
  }
}
