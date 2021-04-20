import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account/account.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { ClientI, UserPasswordUpdateI } from 'src/interfaces/userInterface';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.page.html',
  styleUrls: ['./user-change-password.page.scss'],
})
export class UserChangePasswordPage implements OnInit {

  user: ClientI;

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  isActive: boolean;

  constructor(
    private router: Router,
    private location: Location,
    private accountService: AccountService,
    private loadingController: LoadingController,
    private toasterService: ToasterService
  ) { }

  async ngOnInit() {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Récupération...' });
    await loading.present();
    this.accountService.getAccountProfile().subscribe({
      next: async (data: { error: false, user: ClientI }) => {
        this.initData(data.user);
        await loading.dismiss();
      },
      error: async () => {
        await loading.dismiss();
      },
    });
  }

  async updateUserPassword() {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) { this.toasterService.presentErrorToast('Champs obligatoires manquants'); }
    else if (this.newPassword !== this.confirmPassword) { this.toasterService.presentErrorToast('Les mots de passe doivent être identiques'); }
    else {
      const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Modification...' });
      await loading.present();
      this.accountService.modifyUserPassword(this.generateToUpdateData()).subscribe({
        next: async (data: { error: false, user: ClientI }) => {
          this.initData(data.user);
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          await loading.dismiss();
          this.toasterService.presentSuccessToast('Modification réussie');
        },
        error: async (error: HttpErrorResponse) => {
          await loading.dismiss();
          if (error.error.code === '102102') { this.toasterService.presentErrorToast('Ancien mot de passe invalide'); }
          else if (error.error.code === '102103') { this.toasterService.presentErrorToast('Nouveau mot de passe à trop faible sécurité'); }
          else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
        },
      });
    }
  }

  async updateDoubleAuth() {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: (!this.isActive) ? 'Activation...' : 'Désactivation...' });
    await loading.present();
    this.accountService.modifyUserDoubleAuth({ isActive: this.isActive }).subscribe({
      next: async () => {
        await loading.dismiss();
        if (this.isActive) { this.toasterService.presentSuccessToast('Activation réussie'); }
        if (!this.isActive) { this.toasterService.presentSuccessToast('Désactivation réussie'); }
      },
      error: async (error: HttpErrorResponse) => {
        await loading.dismiss();
        this.toasterService.presentErrorToast('Erreur interne au serveur', { error });
      },
    });
  }

  initData(user: ClientI) {
    this.user = user;
    this.isActive = this.user.doubleAuthentification;
  }

  generateToUpdateData(): UserPasswordUpdateI {
    const toUpdate: UserPasswordUpdateI = {
      email: this.user.email,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
    };
    return toUpdate;
  }

  navigateTo(path: string, id?: string) {
    this.router.navigate([path, id]);
  }

  nagivateBack() {
    this.location.back();
  }

}
