import { formatDate } from '@angular/common';
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
    this.projectService.getProjectList().subscribe({
      next: (data: { error: false, projects: ProjectJsonI[] }) => {
        data.projects.map(project => {
          project.deadline = formatDate(project.deadline, 'longDate', 'fr-FR', 'Europe/France');
        });
        this.projects = data.projects;
        this.filteredProjects = data.projects;
        console.log(data.projects);
      },
    });
  }

  filterProjects(event?: any) {
    if (event && event.target.id === 'status' && event.detail.value) { this.filterStatus = event.detail.value; }
    if (event && event.target.id === 'sorting' && event.detail.value) { this.filterSorting = event.detail.value; }
  }

  navigateTo(path: string, id?: string) {
    this.router.navigate([path, id]);
  }
}
