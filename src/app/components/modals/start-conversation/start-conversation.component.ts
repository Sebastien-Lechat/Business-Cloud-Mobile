import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account/account.service';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { UserService } from 'src/app/services/user/user.service';
import { ConvJsonI } from 'src/interfaces/conversationInterface';
import { ShortUserListI } from 'src/interfaces/userInterface';

@Component({
  selector: 'app-start-conversation',
  templateUrl: './start-conversation.component.html',
  styleUrls: ['./start-conversation.component.scss'],
})
export class StartConversationComponent implements OnInit {

  searchValue = '';
  loading = false;
  users: ShortUserListI[];
  filteredUsers: ShortUserListI[];
  conversations: ConvJsonI[];


  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private accountService: AccountService,
    private conversationService: ConversationService,
    private router: Router,
    private toasterService: ToasterService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.userService.getUsersList().subscribe({
      next: (data: { error: false, users: ShortUserListI[] }) => {
        this.conversationService.getConversationList().subscribe({
          next: (data2: { error: false, conversations: ConvJsonI[] }) => {
            data2.conversations = data2.conversations.filter((conversation: ConvJsonI) => {
              if (conversation.member1.user._id === this.accountService.user.id) {
                data.users = data.users.filter((user) => user.id !== conversation.member2.user._id);
              } else if (conversation.member2.user._id === this.accountService.user.id) {
                data.users = data.users.filter((user) => user._id !== conversation.member1.user._id);
              }
            });
            this.users = data.users;
            this.filteredUsers = data.users;
            this.conversations = data2.conversations;
            this.loading = false;
          },
        });
      },
    });
  }

  async startConversation(userId: string) {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Création...' });
    await loading.present();
    this.conversationService.create(userId).subscribe({
      next: async (data: { error: false, conversation: ConvJsonI }) => {
        await loading.dismiss();
        this.dismiss();
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

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      if (user.role && user.role.toLowerCase().includes(this.searchValue.toLowerCase())) {
        return true;
      } else if (user.name.toLowerCase().includes(this.searchValue.toLowerCase())) {
        return true;
      }
    });
  }

  capitalize(s: any) {
    if (typeof s !== 'string') { return ''; }
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
