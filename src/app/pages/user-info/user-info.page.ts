import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AccountService } from 'src/app/services/account/account.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { ClientI, UserInfoUpdateI } from 'src/interfaces/userInterface';
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
  avatar = '';
  selectedPicture: any;
  showFlag = false;
  croppedImage: string;

  @ViewChild('file') file: ElementRef;

  constructor(
    private router: Router,
    private location: Location,
    private accountService: AccountService,
    private loadingController: LoadingController,
    private toasterService: ToasterService,
    private afStorage: AngularFireStorage
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
    this.loadImg(this.user.avatar);
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
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }

  nagivateBack() {
    this.location.back();
  }

  /* -------------------------------------------------------------------- */

  selectFile() {
    this.file.nativeElement.click();
  }

  fileChangeEvent(event: any) {
    this.selectedPicture = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  loadImageFailed() {
    this.toasterService.presentErrorToast('Erreur lors de l\'importation');
  }

  base64ToFile(data: string, filename: string) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  showLightbox() {
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
  }

  async upload() {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Modification...' });
    await loading.present();
    const file = this.base64ToFile(this.croppedImage, 'image.png');
    this.afStorage.upload('/images/' + file.name + '_' + this.user.id, file)
      .then(() => {
        this.accountService.uploadImg(file.name + '_' + this.user.id).subscribe({
          next: async () => {
            this.loadImg(file.name + '_' + this.user.id);
            await loading.dismiss();
            this.selectedPicture = undefined;
            this.croppedImage = undefined;
            this.toasterService.presentSuccessToast('Modification réussie');
          },
          error: async () => {
            await loading.dismiss();
            this.toasterService.presentErrorToast('Erreur lors de la modification');
          }
        });
      })
      .catch(async () => {
        await loading.dismiss();
        this.toasterService.presentErrorToast('Erreur lors de la modification');
      });
  }

  loadImg(path: string) {
    const ref = this.afStorage.ref('images/' + path);
    ref.getDownloadURL().subscribe({
      next: (data: any) => {
        this.avatar = data;
      }
    });
  }

}
