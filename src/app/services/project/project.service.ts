import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProjectCreateI, ProjectUpdateI } from 'src/interfaces/projectInterface';

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

  transformProject(id: string) {
    return this.http.post<any>(this.url + `project/transform/${id}`, {});
  }

  create(data: ProjectCreateI) {
    return this.http.post<any>(this.url + `project`, data);
  }

  update(data: ProjectUpdateI) {
    return this.http.put<any>(this.url + `project`, data);
  }

  delete(id: string) {
    return this.http.delete<any>(this.url + `project/${id}`);
  }
}
