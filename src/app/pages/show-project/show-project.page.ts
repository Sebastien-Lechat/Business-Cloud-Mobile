import { formatDate, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonRouterOutlet, LoadingController, ModalController } from '@ionic/angular';
import { CalendarProjectComponent } from 'src/app/components/modals/calendar-project/calendar-project.component';
import { ExpenseListComponent } from 'src/app/components/modals/expense-list/expense-list.component';
import { TimeProjectComponent } from 'src/app/components/modals/time-project/time-project.component';
import { ProjectService } from 'src/app/services/project/project.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { UserService } from 'src/app/services/user/user.service';
import { ProjectJsonI } from 'src/interfaces/projectInterface';
import { ClientI } from 'src/interfaces/userInterface';

@Component({
  selector: 'app-show-project',
  templateUrl: './show-project.page.html',
  styleUrls: ['./show-project.page.scss'],
})
export class ShowProjectPage implements OnInit {

  id = '';
  project: ProjectJsonI;
  client: ClientI;
  edit = true;
  billableTime = 0.00;
  progression = 0;

  constructor(
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private projectService: ProjectService,
    private loadingController: LoadingController,
    private toasterService: ToasterService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) { this.initData(); }
  }

  async initData() {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Récupération...' });
    await loading.present();
    this.projectService.getOneProject(this.id).subscribe({
      next: async (data: { error: false, project: ProjectJsonI }) => {
        data.project.createdAt = formatDate(data.project.createdAt, 'yyyy-MM-dd', 'fr-FR', 'Europe/France');
        data.project.deadline = formatDate(data.project.deadline, 'yyyy-MM-dd', 'fr-FR', 'Europe/France');
        this.billableTime = !isNaN(parseFloat((data.project.billing?.billableTime / (1000 * 60 * 60)).toFixed(2))) ? parseFloat((data.project.billing?.billableTime / (1000 * 60 * 60)).toFixed(2)) : 0;
        this.project = data.project;
        this.progression = this.calculateProgression(this.project.createdAt as string, this.project.deadline);
        this.userService.getUser(this.project.clientId.id).subscribe({
          next: async (data2: { error: false, user: ClientI }) => {
            this.client = data2.user;
            await loading.dismiss();
          }
        });
      },
      error: async (error: HttpErrorResponse) => {
        await loading.dismiss();
        this.toasterService.presentErrorToast('Impossible de récupérer cette facture.', { error });
      }
    });
  }

  async deleteProject(): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      message: 'Êtes-vous sur de vouloir supprimer ce projet ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Confirmer',
          role: 'confirm',
          handler: async () => {
            const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Suppression...' });
            await loading.present();
            this.projectService.delete(this.project.id).subscribe({
              next: async () => {
                await loading.dismiss();
                this.router.navigate(['/tabs/tab1']).then(() => {
                  this.toasterService.presentSuccessToast('Suppression du projet réussi');
                });
              },
              error: async (error: HttpErrorResponse) => {
                await loading.dismiss();
                if (error.error.code === '108251') { this.toasterService.presentErrorToast('ID du projet manquant'); }
                else if (error.error.code === '108252') { this.toasterService.presentErrorToast('ID du projet invalide'); }
                else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async completeProject() {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      message: 'Êtes-vous sur de vouloir terminer ce projet ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Confirmer',
          role: 'confirm',
          handler: async () => {
            const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Modification...' });
            await loading.present();
            this.projectService.update({ id: this.project.id, status: 'Terminé' }).subscribe({
              next: async () => {
                await loading.dismiss();
                this.toasterService.presentSuccessToast('Projet terminé');
                this.initData();
              },
              error: async (error) => {
                await loading.dismiss();
                if (error.error.code === '108201') { this.toasterService.presentErrorToast('ID du projet manquant'); }
                else if (error.error.code === '108202') { this.toasterService.presentErrorToast('ID du projet invalide'); }
                else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async transformProject() {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      message: 'Êtes-vous sur de vouloir transformer ce projet en facture ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Confirmer',
          role: 'confirm',
          handler: async () => {
            const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Transformation...' });
            await loading.present();
            this.projectService.transformProject(this.project.id).subscribe({
              next: async (data: { error: false, billId: string }) => {
                await loading.dismiss();
                this.router.navigate(['/tabs/show-bill/', data.billId]).then(() => {
                  this.toasterService.presentSuccessToast('Transformation du projet réussi');
                });
              },
              error: async (error) => {
                await loading.dismiss();
                if (error.error.code === '108301') { this.toasterService.presentErrorToast('Données obligatoires manquantes'); }
                else if (error.error.code === '108302') { this.toasterService.presentErrorToast('ID du projet invalide'); }
                else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async showAddTimeModal() {
    const modal = await this.modalController.create({
      component: TimeProjectComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        projectId: this.id,
      }
    });
    modal.onDidDismiss().then(() => {
      if (this.id) { this.initData(); }
    });
    return await modal.present();
  }

  async showCalendarModal() {
    const modal = await this.modalController.create({
      component: CalendarProjectComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        projectId: this.id,
      }
    });
    modal.onDidDismiss().then(() => {
      if (this.id) { this.initData(); }
    });
    return await modal.present();
  }

  async showListExpenseModal() {
    const modal = await this.modalController.create({
      component: ExpenseListComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        projectId: this.id,
      }
    });
    modal.onDidDismiss().then(() => {
      if (this.id) { this.initData(); }
    });
    return await modal.present();
  }

  redirectToExpense() {
    this.router.navigate(['/tabs/add-page'], { state: { projectId: this.id } });
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }

  calculateProgression(start: string, end: string) {
    if (new Date(end).getTime() - Date.now() < 0) { return 1; }
    else if (Date.now() - new Date(start).getTime() < 0) { return 0; }
    else { return parseFloat(((Date.now() - new Date(start).getTime()) / (new Date(end).getTime() - new Date(start).getTime())).toFixed(2)); }
  }

  nagivateBack() {
    this.location.back();
  }

}
