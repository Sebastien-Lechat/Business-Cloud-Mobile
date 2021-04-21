import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { UserCreateI, UserJsonI } from 'src/interfaces/userInterface';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit {

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  role = '';

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private toasterService: ToasterService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() { }

  async createEmployee() {
    if (!this.name.trim() || !this.email.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
      this.toasterService.presentErrorToast('Données obligatoires manquantes');
    } else if (this.password.trim() !== this.confirmPassword.trim()) {
      this.toasterService.presentErrorToast('Les mots de passe doivent être identiques');
    } else {
      const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Création...' });
      await loading.present();

      const creationData: UserCreateI = {
        name: this.name.trim(),
        email: this.email.trim(),
        password: this.password.trim(),
        role: this.role.trim(),
      };

      this.employeeService.create(creationData).subscribe({
        next: async (data: { error: false, employee: UserJsonI }) => {
          await loading.dismiss();
          this.router.navigate(['/tabs/user-profile', data.employee.id]).then(() => {
            this.toasterService.presentSuccessToast('Création réussie');
          });
        },
        error: async (error: HttpErrorResponse) => {
          await loading.dismiss();
          if (error.error.code === '103301') { this.toasterService.presentErrorToast('Données obligatoires manquantes'); }
          else if (error.error.code === '103302') { this.toasterService.presentErrorToast('Adresse email invalide'); }
          else if (error.error.code === '103303') { this.toasterService.presentErrorToast('Numéro de téléphone invalide'); }
          else if (error.error.code === '103304') { this.toasterService.presentErrorToast('Mot de passe à trop faible sécurité'); }
          else if (error.error.code === '103305') { this.toasterService.presentErrorToast('Rôle de l\'employé invalide'); }
          else if (error.error.code === '103306') { this.toasterService.presentErrorToast('Un compte existe déjà à cette addresse mail'); }
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
