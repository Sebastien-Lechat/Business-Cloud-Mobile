import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProjectCreateI } from 'src/interfaces/projectInterface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  getProjectList() {
    return this.http.get<any>(this.url + `projects`);
  }

  getOneProject(id: string) {
    return this.http.get<any>(this.url + `project/` + id);
  }

  create(data: ProjectCreateI) {
    return this.http.post<any>(this.url + `project`, data);
  }
}
