import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  constructor(
    private router: Router,
    private location: Location,
    private globalService: GlobalService,
    private conversationService: ConversationService,
    public accountService: AccountService,
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

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  nagivateBack() {
    this.location.back();
  }

}
