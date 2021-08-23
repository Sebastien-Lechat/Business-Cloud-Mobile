import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { TimeService } from 'src/app/services/time/time.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { TimeJsonI } from 'src/interfaces/timeInterface';

@Component({
  selector: 'app-calendar-project',
  templateUrl: './calendar-project.component.html',
  styleUrls: ['./calendar-project.component.scss'],
})
export class CalendarProjectComponent implements OnInit {

  projectId: string;
  times: TimeJsonI[];

  constructor(
    public modalController: ModalController,
    public timeService: TimeService,
    private loadingController: LoadingController,
    private toasterService: ToasterService,
  ) { }

  ngOnInit() {
    this.initData();
  }

  async initData() {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Récupération...' });
    await loading.present();
    this.timeService.getTimeList(this.projectId).subscribe({
      next: async (data: { error: false, times: TimeJsonI[] }) => {
        data.times.map((time: TimeJsonI) => {
          time.createdAt = formatDate(time.createdAt, 'dd-MM-yyyy', 'fr-FR', 'Europe/France');
          time.durationFormated = this.formatTime(time.duration);
        });
        this.times = data.times;
        console.log(this.times);
        await loading.dismiss();
      },
      error: async (error: HttpErrorResponse) => {
        await loading.dismiss();
        this.toasterService.presentErrorToast('Impossible de récupérer les temps du projets.', { error });
      }
    });
  }

  formatTime(time: number): string {
    const s = time / 1000;
    const hours = Math.floor(s % (3600 * 24) / 3600);
    const minutes = Math.floor(s % 3600 / 60);
    const seconds = Math.floor(s % 60);
    return (hours) ? hours + 'h' + ((minutes < 10) ? '0' + minutes : (minutes > 10) ? minutes : '00') + 'm' : (minutes) ? minutes + 'm' + seconds + 's' : seconds + 's';
  }

  async editTime(id: string, billable: boolean): Promise<void> {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Modification...' });
    await loading.present();
    this.timeService.update({ id, billable }).subscribe({
      next: async () => {
        this.times.map((time: TimeJsonI) => {
          if (time.id === id) {
            time.billable = !time.billable;
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

  async deleteTime(id: string): Promise<void> {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Suppression...' });
    await loading.present();
    this.timeService.delete(id).subscribe({
      next: async () => {
        this.times = this.times.filter(time => time.id !== id);
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

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
