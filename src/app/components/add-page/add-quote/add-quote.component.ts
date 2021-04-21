import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { EstimateService } from 'src/app/services/estimate/estimate.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { UserService } from 'src/app/services/user/user.service';
import { EstimateCreateI, EstimateI } from 'src/interfaces/estimateInterface';
import { ShortUserListI } from 'src/interfaces/userInterface';

@Component({
  selector: 'app-add-quote',
  templateUrl: './add-quote.component.html',
  styleUrls: ['./add-quote.component.scss'],
})
export class AddQuoteComponent implements OnInit {

  estimateNum = 'DEV000001';

  customersList: ShortUserListI[] = [];
  filteredCustomersList: ShortUserListI[] = [];
  selectedClient = { name: '', selectedId: '' };

  deadline = '';

  reduction = 0;

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private userService: UserService,
    private estimateService: EstimateService,
    private toasterService: ToasterService,
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

  async createEstimate() {
    if (!this.estimateNum.trim() || !this.selectedClient.selectedId || !this.deadline) {
      this.toasterService.presentErrorToast('Données obligatoires manquantes');
    } else {
      const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Création...' });
      await loading.present();

      const creationData: EstimateCreateI = {
        estimateNum: this.estimateNum.trim(),
        clientId: this.selectedClient.selectedId,
        enterpriseId: '606de2cd8522d42a44aa9a9b',
        status: 'En attente',
        deadline: new Date(this.deadline),
        reduction: this.reduction,
        articles: [],
        totalHT: 0,
        totalTTC: 0,
      };

      this.estimateService.create(creationData).subscribe({
        next: async (data: { error: false, estimate: EstimateI }) => {
          await loading.dismiss();
          this.router.navigate(['/tabs/show-quote/', data.estimate.id]).then(() => {
            this.toasterService.presentSuccessToast('Création réussie');
          });
        },
        error: async (error: HttpErrorResponse) => {
          await loading.dismiss();
          if (error.error.code === '105151') { this.toasterService.presentErrorToast('Données obligatoires manquantes'); }
          else if (error.error.code === '105152') { this.toasterService.presentErrorToast('Statut de devis invalide'); }
          else if (error.error.code === '105153') { this.toasterService.presentErrorToast('ID du client invalide'); }
          else if (error.error.code === '105154') { this.toasterService.presentErrorToast('ID de l\'entreprise invalide'); }
          else if (error.error.code === '105155') { this.toasterService.presentErrorToast('Le numéro de devis est déjà utilisé ou invalide'); }
          else if (error.error.code === '105156') { this.toasterService.presentErrorToast('La deadline ne peut pas se situer avant aujourd\'hui'); }
          else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
        }
      });
    }
  }

  navigateTo(path: string, index: number) {
    this.globalService.creationSubject.next(index);
    this.router.navigate([path]);
  }

}
