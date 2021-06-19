import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ClientI } from 'src/interfaces/userInterface';
import { AccountService } from 'src/app/services/account/account.service';
import { LoadingController } from '@ionic/angular';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { AddressUpdateI } from 'src/interfaces/enterpriseInterface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-change-address',
  templateUrl: './user-change-address.page.html',
  styleUrls: ['./user-change-address.page.scss'],
})
export class UserChangeAddressPage implements OnInit {

  user: ClientI;
  address = '';
  zip = '';
  city = '';
  country = '';

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

  initData(user: ClientI) {
    this.user = user;
    this.address = (this.user.type !== 'client') ? this.user.enterprise.address : this.user.address;
    this.zip = (this.user.type !== 'client') ? this.user.enterprise.zip : this.user.zip;
    this.city = (this.user.type !== 'client') ? this.user.enterprise.city : this.user.city;
    this.country = (this.user.type !== 'client') ? this.user.enterprise.country : this.user.country;
  }

  generateToUpdateData(): AddressUpdateI {
    const toUpdate: AddressUpdateI = {};
    if ((this.user.type !== 'client') ? this.address !== this.user.enterprise.address : this.address !== this.user.address) { toUpdate.address = this.address; }
    if ((this.user.type !== 'client') ? this.zip !== this.user.enterprise.zip : this.zip !== this.user.zip) { toUpdate.zip = this.zip; }
    if ((this.user.type !== 'client') ? this.city !== this.user.enterprise.city : this.city !== this.user.city) { toUpdate.city = this.city; }
    if ((this.user.type !== 'client') ? this.country !== this.user.enterprise.country : this.country !== this.user.country) { toUpdate.country = this.country; }
    return toUpdate;
  }

  async updateUserAddress() {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Modification...' });
    await loading.present();
    this.accountService.modifyUserAddress(this.generateToUpdateData()).subscribe({
      next: async (data: { error: false, user: ClientI }) => {
        this.initData(data.user);
        this.toasterService.presentSuccessToast('Modification réussie');
        await loading.dismiss();
      },
      error: async (error: HttpErrorResponse) => {
        await loading.dismiss();
        this.toasterService.presentErrorToast('Erreur interne au serveur', { error });
      },
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  nagivateBack() {
    this.location.back();
  }

}
