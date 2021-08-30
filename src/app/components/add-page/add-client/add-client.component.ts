import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account/account.service';
import { ClientService } from 'src/app/services/client/client.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { UserService } from 'src/app/services/user/user.service';
import { ClientCreateI, ShortUserListI, UserJsonI } from 'src/interfaces/userInterface';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss'],
})
export class AddClientComponent implements OnInit {

  name = '';
  email = '';
  phone = '';
  address = '';
  zip = '';
  city = '';
  country = '';
  password = '';
  confirmPassword = '';
  activity = '';
  numTVA = '';
  numSIRET = '';
  numRCS = '';
  note = '';

  employeesList: ShortUserListI[] = [];
  filteredEmployeesList: ShortUserListI[] = [];

  selectedEmployee = { name: '', selectedId: '' };

  constructor(
    private router: Router,
    private accountService: AccountService,
    private userService: UserService,
    private clientService: ClientService,
    private toasterService: ToasterService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.initAutocomplete();
  }

  initAutocomplete() {
    this.userService.getUsersList().subscribe({
      next: (data: { error: false, users: ShortUserListI[] }) => {
        this.employeesList = data.users.filter(user => user.type === 'user' && user.id !== this.accountService.user.id);
        this.filteredEmployeesList = data.users.filter(user => user.type === 'user' && user.id !== this.accountService.user.id);
      },
    });
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

  async createClient() {
    if (!this.name.trim() || !this.email.trim() || (this.selectedEmployee.name && !this.selectedEmployee.selectedId)) {
      this.toasterService.presentErrorToast('Données obligatoires manquantes');
    } else {
      const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Création...' });
      await loading.present();

      const creationData: ClientCreateI = {
        name: this.name.trim(),
        email: this.email.trim(),
        password: 'Azerty1!',
        address: (this.address.trim() ? this.address.trim() : ''),
        zip: (this.zip.trim() ? this.zip.trim() : ''),
        city: (this.city.trim() ? this.city.trim() : ''),
        country: (this.country.trim() ? this.country.trim() : ''),
        activity: (this.activity.trim() ? this.activity.trim() : ''),
        numTVA: (this.numTVA.trim() ? this.numTVA.trim() : ''),
        numRCS: (this.numRCS.trim() ? this.numRCS.trim() : ''),
        numSIRET: (this.numSIRET.trim() ? this.numSIRET.trim() : ''),
        note: (this.note.trim() ? this.note.trim() : ''),
        userId: this.selectedEmployee.selectedId ? this.selectedEmployee.selectedId : ''
      };

      this.clientService.create(creationData).subscribe({
        next: async (data: { error: false, customer: UserJsonI }) => {
          await loading.dismiss();
          this.router.navigate(['/tabs/user-profile', data.customer.id]).then(() => {
            this.toasterService.presentSuccessToast('Création réussie');
          });
        },
        error: async (error: HttpErrorResponse) => {
          await loading.dismiss();
          if (error.error.code === '103151') { this.toasterService.presentErrorToast('Données obligatoires manquantes'); }
          else if (error.error.code === '103152') { this.toasterService.presentErrorToast('Adresse email invalide'); }
          else if (error.error.code === '103153') { this.toasterService.presentErrorToast('Numéro de téléphone invalide'); }
          else if (error.error.code === '103154') { this.toasterService.presentErrorToast('Mot de passe à trop faible sécurité'); }
          else if (error.error.code === '103155') { this.toasterService.presentErrorToast('Numéro de TVA invalide'); }
          else if (error.error.code === '103156') { this.toasterService.presentErrorToast('Numéro de SIRET invalide'); }
          else if (error.error.code === '103157') { this.toasterService.presentErrorToast('Numéro RCS invalide'); }
          else if (error.error.code === '103158') { this.toasterService.presentErrorToast('Un compte existe déjà à cette addresse mail'); }
          else if (error.error.code === '103158') { this.toasterService.presentErrorToast('ID de l\'employé référent invalide'); }
          else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
        }
      });
    }
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }

}
