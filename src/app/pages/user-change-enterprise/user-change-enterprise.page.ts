import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account/account.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { EnterpriseUpdateI } from 'src/interfaces/enterpriseInterface';
import { ClientI } from 'src/interfaces/userInterface';

@Component({
  selector: 'app-user-change-enterprise',
  templateUrl: './user-change-enterprise.page.html',
  styleUrls: ['./user-change-enterprise.page.scss'],
})
export class UserChangeEnterprisePage implements OnInit {

  user: ClientI;
  activity = '';
  numTVA = '';
  numRCS = '';
  numSIRET = '';

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
    this.activity = (this.user.type !== 'client') ? this.user.enterprise.activity : this.user.activity;
    this.numTVA = (this.user.type !== 'client') ? this.user.enterprise.numTVA : this.user.numTVA;
    this.numRCS = (this.user.type !== 'client') ? this.user.enterprise.numRCS : this.user.numRCS;
    this.numSIRET = (this.user.type !== 'client') ? this.user.enterprise.numSIRET : this.user.numSIRET;
  }

  generateToUpdateData(): EnterpriseUpdateI {
    const toUpdate: EnterpriseUpdateI = {};
    if ((this.user.type !== 'client') ? this.activity !== this.user.enterprise.activity : this.activity !== this.user.activity) { toUpdate.activity = this.activity; }
    if ((this.user.type !== 'client') ? this.numTVA !== this.user.enterprise.numTVA : this.numTVA !== this.user.numTVA) { toUpdate.numTVA = this.numTVA; }
    if ((this.user.type !== 'client') ? this.numRCS !== this.user.enterprise.numRCS : this.numRCS !== this.user.numRCS) { toUpdate.numRCS = this.numRCS; }
    if ((this.user.type !== 'client') ? this.numSIRET !== this.user.enterprise.numSIRET : this.numSIRET !== this.user.numSIRET) { toUpdate.numSIRET = this.numSIRET; }
    return toUpdate;
  }

  async updateUserEnterprise() {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Modification...' });
    await loading.present();
    this.accountService.modifyUserEnterprise(this.generateToUpdateData()).subscribe({
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
