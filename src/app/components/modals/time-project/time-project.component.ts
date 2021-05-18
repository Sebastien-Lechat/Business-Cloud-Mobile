import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account/account.service';
import { TimeService } from 'src/app/services/time/time.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { TimeJsonI } from 'src/interfaces/timeInterface';

@Component({
  selector: 'app-time-project',
  templateUrl: './time-project.component.html',
  styleUrls: ['./time-project.component.scss'],
})
export class TimeProjectComponent implements OnInit, OnDestroy {

  projectId: string;
  times: TimeJsonI[];

  counter: number;
  timer = '00:00:00';
  second = 0;
  timerRef: number;
  running = false;

  constructor(
    public modalController: ModalController,
    public timeService: TimeService,
    private loadingController: LoadingController,
    private accountService: AccountService,
    private toasterService: ToasterService,
    public alertController: AlertController,
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
          time.createdAt = formatDate(time.createdAt, 'yyyy-MM-dd', 'fr-FR', 'Europe/France');
          time.durationFormated = this.formatTime(time.duration);
        });
        this.times = data.times;
        await loading.dismiss();
      },
      error: async (error) => {
        await loading.dismiss();
        this.toasterService.presentErrorToast('Impossible de récupérer les temps du projets.', { error });
      }
    });
  }

  startTimer() {
    this.running = !this.running;
    if (this.running) {
      const startTime = Date.now() - (this.counter || 0);
      this.timerRef = setInterval(() => {
        this.counter = Date.now() - startTime;
        this.timer = this.msToTime(this.counter);
      });
    } else {
      clearInterval(this.timerRef);
    }
  }

  async clearTimer(save: boolean) {
    this.running = false;
    if (save) { await this.createTime(); }
    this.timer = '00:00:00';
    this.second = 0;
    this.counter = undefined;
    clearInterval(this.timerRef);
  }

  async dismiss() {
    if (this.counter) {
      const alert = await this.alertController.create({
        cssClass: 'alert-class',
        message: 'Vous avez un temps en cours d\'enregistrement, si vous quittez la page il sera perdu.',
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            cssClass: 'secondary',
          }, {
            text: 'Confirmer',
            handler: () => {
              this.modalController.dismiss({
                dismissed: true
              });
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.modalController.dismiss({
        dismissed: true
      });
    }
  }

  msToTime(s: number) {
    const pad = (n: string | number, z = 2) => ('00' + n).slice(-z);
    // tslint:disable-next-line: no-bitwise
    if ((parseInt(pad((s % 60000) / 1000 | 0), 10)) !== this.second) {
      this.second += 1;
      if (this.second === 60) {
        this.second = 0;
      }
    }
    // tslint:disable-next-line: no-bitwise
    return pad(s / 3600000 | 0) + ':' + pad((s % 3600000) / 60000 | 0) + ':' + pad((s % 60000) / 1000 | 0);
  }

  formatTime(time: number): string {
    const s = time / 1000;
    const hours = Math.floor(s % (3600 * 24) / 3600);
    const minutes = Math.floor(s % 3600 / 60);
    const seconds = Math.floor(s % 60);
    return (hours) ? hours + 'h' + ((minutes < 10) ? '0' + minutes : (minutes > 10) ? minutes : '00') + 'm' : (minutes) ? minutes + 'm' + seconds + 's' : seconds + 's';
  }

  async createTime(): Promise<void> {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Création...' });
    await loading.present();
    this.timeService.create({ userId: this.accountService.user.id, projectId: this.projectId, billable: true, duration: this.counter }).subscribe({
      next: async (data: { error: false, time: TimeJsonI }) => {
        data.time.createdAt = formatDate(data.time.createdAt, 'yyyy-MM-dd', 'fr-FR', 'Europe/France');
        data.time.durationFormated = this.formatTime(data.time.duration);
        this.times.unshift(data.time);
        await loading.dismiss();
        this.toasterService.presentSuccessToast('Temps enregistré');
      },
      error: async (error) => {
        await loading.dismiss();
        if (error.error.code === '110101') { this.toasterService.presentErrorToast('Données obligatoires manquantes'); }
        else if (error.error.code === '110102') { this.toasterService.presentErrorToast('ID de projet invalide'); }
        else if (error.error.code === '110104') { this.toasterService.presentErrorToast('Format du champs billable invalide'); }
        else if (error.error.code === '110105') { this.toasterService.presentErrorToast('Format de la durée invalide'); }
        else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
      }
    });
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

  ngOnDestroy(): void {
    clearInterval(this.timerRef);
  }

}
