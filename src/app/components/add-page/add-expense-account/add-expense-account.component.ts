import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { UserExpenseService } from 'src/app/services/userExpense/user-expense.service';
import { UserExpenseCreateI } from 'src/interfaces/userExpense';

@Component({
  selector: 'app-add-expense-account',
  templateUrl: './add-expense-account.component.html',
  styleUrls: ['./add-expense-account.component.scss'],
})
export class AddExpenseAccountComponent implements OnInit {

  userExpenseNum = 'UEXP' + this.randomInRange(100000, 999999);
  price = 0;
  category = '';
  file = '';
  description = '';
  accountNumber = 999999;

  constructor(
    private router: Router,
    private userExpenseService: UserExpenseService,
    private toasterService: ToasterService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
  }

  async createUserExpense() {
    if (!this.userExpenseNum.trim() || !this.price || !this.accountNumber) {
      this.toasterService.presentErrorToast('Données obligatoires manquantes');
    } else {
      const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Création...' });
      await loading.present();

      const creationData: UserExpenseCreateI = {
        userExpenseNum: this.userExpenseNum,
        price: this.price,
        accountNumber: this.accountNumber,
        category: this.category,
        file: this.file,
        description: this.description,
      };

      this.userExpenseService.create(creationData).subscribe({
        next: async () => {
          await loading.dismiss();
          this.router.navigate(['/tabs/tab3']).then(() => {
            this.toasterService.presentSuccessToast('Création réussie');
          });
        },
        error: async (error: HttpErrorResponse) => {
          await loading.dismiss();
          if (error.error.code === '107101') { this.toasterService.presentErrorToast('Données obligatoires manquantes'); }
          else if (error.error.code === '107102') { this.toasterService.presentErrorToast('Numéro de note de frais invalide'); }
          else if (error.error.code === '107103') { this.toasterService.presentErrorToast('Format du numéro de compte invalide'); }
          else if (error.error.code === '107104') { this.toasterService.presentErrorToast('Format du prix invalide'); }
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
