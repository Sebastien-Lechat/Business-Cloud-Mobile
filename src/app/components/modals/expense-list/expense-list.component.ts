import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { ExpenseJsonI } from 'src/interfaces/expenseInterface';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit {

  projectId: string;
  expenses: ExpenseJsonI[];

  constructor(
    private router: Router,
    public modalController: ModalController,
    private loadingController: LoadingController,
    private toasterService: ToasterService,
    private expenseService: ExpenseService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.initData();
  }

  async initData() {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Récupération...' });
    await loading.present();
    this.expenseService.getExpenseList(this.projectId).subscribe({
      next: async (data: { error: false, expenses: ExpenseJsonI[] }) => {
        data.expenses.map((expense: ExpenseJsonI) => {
          expense.createdAt = formatDate(expense.createdAt, 'yyyy-MM-dd', 'fr-FR', 'Europe/France');
        });
        this.expenses = data.expenses;
        await loading.dismiss();
      },
      error: async (error: HttpErrorResponse) => {
        await loading.dismiss();
        this.toasterService.presentErrorToast('Impossible de récupérer les dépenses du projets.', { error });
      }
    });
  }

  async editExpense(id: string, billable: boolean): Promise<void> {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Modification...' });
    await loading.present();
    this.expenseService.update({ id, billable }).subscribe({
      next: async () => {
        this.expenses.map((expense: ExpenseJsonI) => {
          if (expense.id === id) {
            expense.billable = !expense.billable;
          }
        });
        await loading.dismiss();
        (billable) ? this.toasterService.presentSuccessToast('Le temps est maintenant facturable') : this.toasterService.presentSuccessToast('Le temps n\'est plus facturable');
      },
      error: async (error) => {
        await loading.dismiss();
        if (error.error.code === '110151') { this.toasterService.presentErrorToast('Données obligatoires manquantes'); }
        else if (error.error.code === '110152') { this.toasterService.presentErrorToast('ID du temps invalide'); }
        else if (error.error.code === '110153') { this.toasterService.presentErrorToast('Format du champs billable invalide'); }
        else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
      }
    });
  }

  async deleteExpense(id: string): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      message: 'Êtes-vous sur de vouloir supprimer cette dépense ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Confirmer',
          role: 'confirm',
          handler: async () => {
            await alert.present();
            const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Suppression...' });
            await loading.present();
            this.expenseService.delete(id).subscribe({
              next: async () => {
                this.expenses = this.expenses.filter(expense => expense.id !== id);
                await loading.dismiss();
                this.toasterService.presentSuccessToast('Suppression du temps réussie');
              },
              error: async (error) => {
                await loading.dismiss();
                if (error.error.code === '110201') { this.toasterService.presentErrorToast('Données obligatoires manquantes'); }
                else if (error.error.code === '110202') { this.toasterService.presentErrorToast('ID du temps invalide'); }
                else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  formatTime(time: number): string {
    const s = time / 1000;
    const hours = Math.floor(s % (3600 * 24) / 3600);
    const minutes = Math.floor(s % 3600 / 60);
    const seconds = Math.floor(s % 60);
    return (hours) ? hours + 'h' + ((minutes < 10) ? '0' + minutes : (minutes > 10) ? minutes : '00') + 'm' : (minutes) ? minutes + 'm' + seconds + 's' : seconds + 's';
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  showExpense(id: string) {
    this.dismiss();
    this.router.navigate(['/tabs/show-expense/', id]);
  }

}
