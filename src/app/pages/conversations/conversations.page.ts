import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account/account.service';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { ConvJsonI } from 'src/interfaces/conversationInterface';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.page.html',
  styleUrls: ['./conversations.page.scss'],
})
export class ConversationsPage implements OnInit {

  conversations: ConvJsonI[];
  loading = false;
  avatarList = {};

  constructor(
    private router: Router,
    private location: Location,
    private globalService: GlobalService,
    private conversationService: ConversationService,
    public accountService: AccountService,
    private afStorage: AngularFireStorage,
  ) { }

  ngOnInit() {
    this.globalService.closeConv.subscribe({
      next: (closed: boolean) => {
        if (closed) {
          this.initData();
        }
      },
    });
  }

  ionViewWillEnter(): void {
    this.initData();
  }

  initData() {
    this.loading = true;
    this.conversationService.getConversationList().subscribe({
      next: (data: { error: false, conversations: ConvJsonI[] }) => {
        data.conversations.map((conversation: ConvJsonI) => {
          conversation.otherId = conversation.member1.user._id !== this.accountService.user.id ? conversation.member1.user._id : conversation.member2.user._id;
          conversation.otherName = conversation.member1.user._id !== this.accountService.user.id ? conversation.member1.user.name : conversation.member2.user.name;
          conversation.otherAvatar = conversation.member1.user._id !== this.accountService.user.id ? conversation.member1.user.avatar : conversation.member2.user.avatar;

          if (conversation.otherAvatar) { this.loadImg(conversation.otherId, conversation.otherAvatar); }
          else { this.avatarList[conversation.otherId] = { data: undefined, loaded: true }; }
          conversation.updatedAt = this.formatUpdatedAt(conversation.updatedAt as string);
        });
        this.conversations = data.conversations;
        this.loading = false;
      },
    });
  }

  formatUpdatedAt(date: string): string {
    const s = (Date.now() - new Date(date).getTime()) / 1000;
    const day = Math.floor(s / (3600 * 24));
    const hours = Math.floor(s % (3600 * 24) / 3600);
    const minutes = Math.floor(s % 3600 / 60);
    const seconds = Math.floor(s % 60);
    return (day) ? day + 'j' : (hours) ? hours + 'h' : (minutes) ? minutes + 'm' : seconds + 's';
  }

  loadImg(id: string, path: string) {
    this.avatarList[id] = { data: undefined, loaded: false };
    const ref = this.afStorage.ref('images/' + path);
    ref.getDownloadURL().subscribe({
      next: (data: any) => {
        this.avatarList[id] = { data, loaded: true };
      },
      error: () => {
        this.avatarList[id].loaded = true;
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  nagivateBack() {
    this.location.back();
  }

}
