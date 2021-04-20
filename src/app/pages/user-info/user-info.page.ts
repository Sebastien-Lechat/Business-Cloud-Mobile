import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';
import { ClientI, UserInfoUpdateI } from 'src/interfaces/userInterface';
import { LoadingController } from '@ionic/angular';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.page.html',
  styleUrls: ['./user-info.page.scss'],
})
export class UserInfoPage implements OnInit {

  user: ClientI;
  name = '';
  email = '';
  phone = '';
  birthdayDate = '';

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

  async updateUserInfo() {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Modification...' });
    await loading.present();
    this.accountService.modifyUserInfo(this.generateToUpdateData()).subscribe({
      next: async (data: { error: false, user: ClientI }) => {
        this.initData(data.user);
        this.toasterService.presentSuccessToast('Modification réussie');
        await loading.dismiss();
      },
      error: async (error: HttpErrorResponse) => {
        await loading.dismiss();
        if (error.error.code === '102051') { this.toasterService.presentErrorToast('Adresse email invalide'); }
        else if (error.error.code === '102052') { this.toasterService.presentErrorToast('Numéro de téléphone invalide'); }
        else if (error.error.code === '102053') { this.toasterService.presentErrorToast('Date de naissance invalide'); }
        else if (error.error.code === '102054') { this.toasterService.presentErrorToast('L\'eamil est déjà utilisé par un autre utilisateur'); }
        else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
      },
    });
  }

  initData(user: ClientI) {
    this.user = user;
    this.name = user.name;
    this.email = user.email;
    if (user.phone) { this.phone = user.phone; }
    if (user.birthdayDate) { this.birthdayDate = user.birthdayDate; }
  }

  generateToUpdateData(): UserInfoUpdateI {
    const toUpdate: UserInfoUpdateI = {};
    if (this.name !== this.user.name) { toUpdate.name = this.name; }
    if (this.email !== this.user.email) { toUpdate.email = this.email; }
    if (this.phone !== this.user.phone) { toUpdate.phone = this.phone; }
    if (this.birthdayDate !== this.user.birthdayDate) { toUpdate.birthdayDate = this.birthdayDate; }
    return toUpdate;
  }

  navigateTo(path: string, id?: string) {
    this.router.navigate([path, id]);
  }

  nagivateBack() {
    this.location.back();
  }
}
