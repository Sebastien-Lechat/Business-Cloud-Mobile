import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet, LoadingController, ModalController } from '@ionic/angular';
import { UserHistoryComponent } from 'src/app/components/modals/user-history/user-history.component';
import { BillService } from 'src/app/services/bill/bill.service';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
import { EstimateService } from 'src/app/services/estimate/estimate.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { UserService } from 'src/app/services/user/user.service';
import { BillI } from 'src/interfaces/billInterface';
import { ConvJsonI } from 'src/interfaces/conversationInterface';
import { EstimateI } from 'src/interfaces/estimateInterface';
import { ShortUserListI, UserJsonI } from 'src/interfaces/userInterface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  id = '';
  user: UserJsonI;
  avatar = '';
  showFlag = false;
  avatarLoaded = false;

  files: any[] = [];

  requestEnd = 0;

  updateFile = false;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private userService: UserService,
    private billService: BillService,
    private estimateService: EstimateService,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private afStorage: AngularFireStorage,
    private toasterService: ToasterService,
    private loadingController: LoadingController,
    private conversationService: ConversationService,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) { this.initData(); }
  }

  initData() {
    this.userService.getUser(this.id).subscribe({
      next: (data: { error: false, user: UserJsonI }) => {
        this.user = data.user;
        this.loadImg(this.user.avatar);

        if (this.user.type === 'client') {
          this.updateFile = true;
          this.billService.getBillList().subscribe({
            next: (data2: { error: false, bills: BillI[] }) => {
              data2.bills = data2.bills.filter(bill => {
                return (bill.clientId as ShortUserListI).id === this.user.id;
              });
              data2.bills.map((bill) => {
                this.files.push(bill);
              });
              this.sortFiles(this.requestEnd += 1);
            },
          });

          this.estimateService.getEstimateList().subscribe({
            next: (data2: { error: false, estimates: EstimateI[] }) => {
              data2.estimates = data2.estimates.filter(estimate => {
                return (estimate.clientId as ShortUserListI).id === this.user.id;
              });
              data2.estimates.map((estimate) => {
                this.files.push(estimate);
              });
              this.sortFiles(this.requestEnd += 1);
            },
          });
        }
      }
    });
  }

  sortFiles(count: number) {
    if (count === 2) {
      this.updateFile = false;
      this.files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }

  async showHistory() {
    const modal = await this.modalController.create({
      component: UserHistoryComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: {
        id: this.id,
      }
    });
    return await modal.present();
  }

  showLightbox() {
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
  }

  loadImg(path: string) {
    const ref = this.afStorage.ref('images/' + path);
    ref.getDownloadURL().subscribe({
      next: (data: any) => {
        this.avatar = data;
        this.avatarLoaded = true;
      },
      error: () => {
        this.avatarLoaded = true;
      }
    });
  }

  async startConversation(userId: string) {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Redirection...' });
    await loading.present();
    this.conversationService.create(userId).subscribe({
      next: async (data: { error: false, conversation: ConvJsonI }) => {
        await loading.dismiss();
        this.router.navigate(['/messages/' + data.conversation.id]).then(() => {
          this.toasterService.presentSuccessToast('Conversation créée');
        });
      },
      error: async (error: HttpErrorResponse) => {
        await loading.dismiss();
        if (error.error.code === '112101') { this.toasterService.presentErrorToast('Données obligatoires manquantes'); }
        else if (error.error.code === '112102') { this.toasterService.presentErrorToast('Impossible de créer une conversation avec vous-même'); }
        else if (error.error.code === '112103') { this.toasterService.presentErrorToast('ID de la cible invalide'); }
        else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
      }
    });
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  nagivateBack() {
    this.location.back();
  }

}
