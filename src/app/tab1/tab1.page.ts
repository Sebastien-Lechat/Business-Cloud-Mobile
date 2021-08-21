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
  }

  ionViewWillEnter(): void {
    this.initData();
  }

  initData() {
    this.loading = true;
    this.projectService.getProjectList().subscribe({
      next: (data: { error: false, projects: ProjectJsonI[] }) => {
        this.sortProject(this.filteredProjects, 'createdAt', 0);
        data.projects.map((project: ProjectJsonI) => {
          project.createdAt = formatDate(project.createdAt, 'yyyy-MM-dd', 'fr-FR', 'Europe/France');
          project.deadline = formatDate(project.deadline, 'yyyy-MM-dd', 'fr-FR', 'Europe/France');
          project.progression = this.calculateProgression(project.createdAt as string, project.deadline);

          project.totalHours = !isNaN(parseFloat((project.billing?.billableTime / (1000 * 60 * 60)).toFixed(2))) ? parseFloat((project.billing?.billableTime / (1000 * 60 * 60)).toFixed(2)) : 0;
          project.total = project.fixedRate ? project.fixedRate - (project.billing?.additionalExpense ? project.billing?.additionalExpense : 0) : project.hourlyRate * project.totalHours;
        });
        this.projects = data.projects;
        this.filteredProjects = data.projects;
        this.filterProjects();
        this.loading = false;
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
    (direction === 0) ? array.sort((a, b) => new Date(b[value]).getTime() - new Date(a[value]).getTime()) : array.sort((a, b) => new Date(a[value]).getTime() - new Date(b[value]).getTime());
  }

  refreshData(event: any) {
    this.initData();
    event.target.complete();
  }

  calculateProgression(start: string, end: string) {
    if (new Date(end).getTime() - Date.now() < 0) { return 1; }
    else if (Date.now() - new Date(start).getTime() < 0) { return 0; }
    else { return parseFloat(((Date.now() - new Date(start).getTime()) / (new Date(end).getTime() - new Date(start).getTime())).toFixed(2)); }
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }
}
