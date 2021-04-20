import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toastController: ToastController) { }

  public async presentSuccessToast(messageToPrint: string, options: { toasterDuration?: number } = {}) {
    const toast = await this.toastController.create({
      message: messageToPrint,
      duration: options.toasterDuration || 1500,
      position: 'bottom',
      color: 'success',
      cssClass: 'toaster-div'
    });
    toast.present();
  }

  public async presentErrorToast(messageToPrint: string, options: { error?: HttpErrorResponse, toasterDuration?: number } = {}) {
    if (options.error) { console.log(options.error); }
    const toast = await this.toastController.create({
      message: messageToPrint,
      duration: options.toasterDuration || 1500,
      position: 'bottom',
      color: 'danger',
      cssClass: 'toaster-div'
    });
    toast.present();
  }
}
