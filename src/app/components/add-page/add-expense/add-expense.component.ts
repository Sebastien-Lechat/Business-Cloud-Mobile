import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { ProjectService } from 'src/app/services/project/project.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { ExpenseCreateI } from 'src/interfaces/expenseInterface';
import { ProjectJsonI } from 'src/interfaces/projectInterface';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss'],
})
export class AddExpenseComponent implements OnInit {

  expenseNum = 'EXP' + this.randomInRange(100000, 999999);
  price = 0;
  accountNumber = 999999;
  category = '';
  file = 'file';
  description = '';
  billable = true;

  projectList: ProjectJsonI[] = [];
  filteredProjectList: ProjectJsonI[] = [];
  selectedProject = { name: '', selectedId: '' };


  constructor(
    private router: Router,
    private projectService: ProjectService,
    private expenseService: ExpenseService,
    private toasterService: ToasterService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.initAutocomplete();
  }

  initAutocomplete() {
    this.projectService.getProjectList().subscribe({
      next: (data: { error: false, projects: ProjectJsonI[] }) => {
        this.projectList = data.projects;
        this.filteredProjectList = data.projects;
      },
    });
  }

  filterProject(event?: any) {
    if (event) {
      this.selectedProject.selectedId = event.option.value;
      this.projectList.map(project => {
        if (project.id === event.option.value) { this.selectedProject.name = project.title; }
      });
    } else {
      this.selectedProject.selectedId = '';
      this.filteredProjectList = this.projectList.filter(project => {
        if (project.title.toLocaleLowerCase().includes(this.selectedProject.name.toLocaleLowerCase())) { return true; }
      });
    }
  }

  async createExpense() {
    if (!this.expenseNum.trim() || !this.price || !this.accountNumber || (this.selectedProject.name && !this.selectedProject.selectedId)) {
      this.toasterService.presentErrorToast('Données obligatoires manquantes');
    } else {
      const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Création...' });
      await loading.present();

      const creationData: ExpenseCreateI = {
        expenseNum: this.expenseNum.trim(),
        price: this.price,
        accountNumber: this.accountNumber,
        category: this.category,
        file: this.file,
        description: (this.description.trim()) ? this.description.trim() : '',
        projectId: this.selectedProject.selectedId,
        billable: this.billable,
      };

      this.expenseService.create(creationData).subscribe({
        next: async () => {
          await loading.dismiss();
          this.router.navigate(['/tabs/tab3']).then(() => {
            this.toasterService.presentSuccessToast('Création réussie');
          });
        },
        error: async (error: HttpErrorResponse) => {
          await loading.dismiss();
          if (error.error.code === '111101') { this.toasterService.presentErrorToast('Données obligatoires manquantes'); }
          else if (error.error.code === '111102') { this.toasterService.presentErrorToast('Numéro de dépense invalide'); }
          else if (error.error.code === '111103') { this.toasterService.presentErrorToast('Format du numéro de compte invalide'); }
          else if (error.error.code === '111104') { this.toasterService.presentErrorToast('Format du prix invalide'); }
          else if (error.error.code === '111106') { this.toasterService.presentErrorToast('ID du projet invalide'); }
          else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
        }
      });
    }
  }

  randomInRange(from: number, to: number) {
    const r = Math.random();
    return Math.floor(r * (to - from) + from);
  }

}
