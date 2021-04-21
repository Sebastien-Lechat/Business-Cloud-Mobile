import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectJsonI } from 'src/interfaces/projectInterface';
import { ProjectService } from '../services/project/project.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  projects: ProjectJsonI[] = [];
  filteredProjects: ProjectJsonI[] = [];

  searchValue = '';
  loading = false;

  filterStatus = '0';
  filterSorting = '0';

  constructor(private router: Router, private projectService: ProjectService) { }

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    this.loading = true;
    this.projectService.getProjectList().subscribe({
      next: (data: { error: false, projects: ProjectJsonI[] }) => {
        this.loading = false;
        this.sortProject(this.filteredProjects, 'createdAt', 0);
        this.projects = data.projects;
        this.filteredProjects = data.projects;
      },
    });
  }

  filterProjects(event?: any) {
    if (event && event.target.id === 'status' && event.detail.value) { this.filterStatus = event.detail.value; }
    if (event && event.target.id === 'sorting' && event.detail.value) { this.filterSorting = event.detail.value; }

    this.filteredProjects = this.projects.filter(project => {
      const searchProject = (): boolean => {
        if (project.projectNum.toLowerCase().includes(this.searchValue.toLowerCase())) {
          return true;
        } else if (project.clientId.name.toLowerCase().includes(this.searchValue.toLowerCase())) { return true; }
      };

      if (this.filterStatus === '1' && project.status === 'Terminé') {
        return searchProject();
      } else if (this.filterStatus === '2' && project.status === 'En retard') {
        return searchProject();
      } else if (this.filterStatus === '3' && (project.status === 'En attente' || project.status === 'En cours')) {
        return searchProject();
      } else if (this.filterStatus === '0') {
        return searchProject();
      }
    });

    if (this.filterSorting === '0') { this.sortProject(this.filteredProjects, 'createdAt', 0); }
    else if (this.filterSorting === '1') { this.sortProject(this.filteredProjects, 'startDate', 1); }
    else if (this.filterSorting === '2') { this.sortProject(this.filteredProjects, 'startDate', 0); }
    else if (this.filterSorting === '3') { this.sortProject(this.filteredProjects, 'deadline', 1); }
    else if (this.filterSorting === '4') { this.sortProject(this.filteredProjects, 'deadline', 0); }
  }

  sortProject(array: Array<any>, value: string, direction: 0 | 1) {
    console.log(array);
    (direction === 0) ? array.sort((a, b) => new Date(b[value]).getTime() - new Date(a[value]).getTime()) : array.sort((a, b) => new Date(a[value]).getTime() - new Date(b[value]).getTime());
  }

  refreshData(event: any) {
    this.initData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }
}
