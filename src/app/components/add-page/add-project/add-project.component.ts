import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ProjectService } from 'src/app/services/project/project.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { UserService } from 'src/app/services/user/user.service';
import { ProjectCreateI, ProjectJsonI } from 'src/interfaces/projectInterface';
import { ShortUserListI } from 'src/interfaces/userInterface';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
})
export class AddProjectComponent implements OnInit {

  projectNum = 'PRO000001';
  title = '';

  customersList: ShortUserListI[] = [];
  employeesList: ShortUserListI[] = [];
  filteredCustomersList: ShortUserListI[] = [];
  filteredEmployeesList: ShortUserListI[] = [];

  selectedClient = { name: '', selectedId: '' };
  selectedEmployee = { name: '', selectedId: '' };
  selectedEmployeeList: { name: string, selectedId: string }[] = [];

  progression = 0;

  startDate = '';
  deadline = '';

  description = '';

  fixedRate = 0;
  hourlyRate = 0;
  estimateHours = 0;

  constructor(
    private router: Router,
    private userService: UserService,
    private toasterService: ToasterService,
    private projectService: ProjectService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.initAutocomplete();
  }

  initAutocomplete() {
    this.userService.getUsersList().subscribe({
      next: (data: { error: false, users: ShortUserListI[] }) => {
        this.customersList = data.users.filter(user => user.type === 'client');
        this.filteredCustomersList = data.users.filter(user => user.type === 'client');
        this.employeesList = data.users.filter(user => user.type === 'user' && (user.role !== 'Gérant' || user.role === undefined));
        this.filteredEmployeesList = data.users.filter(user => user.type === 'user' && (user.role !== 'Gérant' || user.role === undefined));
      },
    });
  }

  filterCustomer(event?: any) {
    if (event) {
      this.selectedClient.selectedId = event.option.value;
      this.customersList.map(customer => {
        if (customer.id === event.option.value) { this.selectedClient.name = customer.name; }
      });
    } else {
      this.selectedClient.selectedId = '';
      this.filteredCustomersList = this.customersList.filter(customer => {
        if (customer.name.toLocaleLowerCase().includes(this.selectedClient.name.toLocaleLowerCase())) { return true; }
      });
    }
  }

  filterEmployee(event?: any) {
    if (event) {
      this.selectedEmployee.selectedId = event.option.value;
      this.employeesList.map(employee => {
        if (employee.id === event.option.value) { this.selectedEmployee.name = employee.name; }
      });
    } else {
      this.selectedEmployee.selectedId = '';
      this.filteredEmployeesList = this.employeesList.filter(employee => {
        if (employee.name.toLocaleLowerCase().includes(this.selectedEmployee.name.toLocaleLowerCase())) { return true; }
      });
    }
  }

  addEmployee() {
    if (this.selectedEmployee.name && this.selectedEmployee.selectedId) {
      if (!this.selectedEmployeeList.find(employee => employee.selectedId === this.selectedEmployee.selectedId)) {
        this.selectedEmployeeList.push(this.selectedEmployee);
      } else {
        this.toasterService.presentErrorToast('Cet employé est déjà séléctionné');
      }
      this.selectedEmployee = { name: '', selectedId: '' };
    }
  }

  deleteEmployee(id: string) {
    this.selectedEmployeeList.filter(employee => employee.selectedId !== id);
  }

  updateProgression(event: any) {
    this.progression = event.detail.value;
  }

  async createProject() {
    // console.log(this.projectNum, this.title, this.selectedEmployeeList.length === 0, this.selectedClient.selectedId, this.startDate, this.deadline);
    if (!this.projectNum || !this.title || this.selectedEmployeeList.length === 0 || !this.selectedClient.selectedId || !this.startDate || !this.deadline) {
      this.toasterService.presentErrorToast('Données obligatoires manquantes');
    } else {
      const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Création...' });
      await loading.present();

      const creationData: ProjectCreateI = {
        projectNum: this.projectNum,
        title: this.title,
        clientId: this.selectedClient.selectedId,
        status: 'En cours',
        startDate: new Date(this.startDate),
        deadline: new Date(this.deadline),
        employees: [],
        progression: this.progression,
        estimateHour: this.estimateHours,
        fixedRate: (this.hourlyRate === 0 && this.fixedRate !== 0) ? this.fixedRate : undefined,
        hourlyRate: (this.fixedRate === 0 && this.hourlyRate !== 0) ? this.hourlyRate : undefined,
      };

      this.selectedEmployeeList.map(employee => {
        creationData.employees.push({ id: employee.selectedId.toString() });
      });

      console.log(creationData);

      this.projectService.create(creationData).subscribe({
        next: async (data: { error: false, project: ProjectJsonI }) => {
          await loading.dismiss();
          this.router.navigate(['/tabs/show-project/', data.project.id]).then(() => {
            this.toasterService.presentSuccessToast('Création réussie');
          });
        },
        error: async (error: HttpErrorResponse) => {
          console.log(error);
          await loading.dismiss();
          if (error.error.code === '108151') { this.toasterService.presentErrorToast('Données obligatoires manquantes'); }
          else if (error.error.code === '108152') { this.toasterService.presentErrorToast('Statut de projet invalide'); }
          else if (error.error.code === '108153') { this.toasterService.presentErrorToast('ID du client invalide'); }
          else if (error.error.code === '108154') { this.toasterService.presentErrorToast('Le numéro de projet est déjà utilisé ou invalide'); }
          else if (error.error.code === '108156') { this.toasterService.presentErrorToast('La deadline ne peut pas se situer avant aujourd\'hui'); }
          else if (error.error.code === '108157') { this.toasterService.presentErrorToast('Certains ID employé sont invalide'); }
          else if (error.error.code === '108158') { this.toasterService.presentErrorToast('Impossible d\'avoir les deux system de facturation actif'); }
          else if (error.error.code === '108162') { this.toasterService.presentErrorToast('La date de fin ne peut pas se situer après la deadline'); }
          else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
        }
      });
    }
  }

}
