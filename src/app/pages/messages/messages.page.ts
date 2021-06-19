import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AccountService } from 'src/app/services/account/account.service';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
import { SocketService } from 'src/app/services/global/socket.service';
import { ConvJsonI, MessageI } from 'src/interfaces/conversationInterface';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  conversationId: string;
  conversation: ConvJsonI;

  messages: MessageI[] = [];
  message = '';
  newIsPrinted = false;

  target: { _id: string, name: string, socketToken: string };

  loading = false;

  @ViewChild('list') list: IonContent;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    private socketService: SocketService,
    public accountService: AccountService,
  ) { }

  ngOnInit() {
    this.conversationId = this.route.snapshot.paramMap.get('id');
    if (this.conversationId) { this.initData(); }
    else { this.location.back(); }
  }

  initData() {
    this.loading = true;
    this.conversationService.getConversation(this.conversationId).subscribe({
      next: (data: { error: false, conversation: ConvJsonI }) => {
        this.conversation = data.conversation;
        this.target = this.conversation.member1.user._id !== this.accountService.user.id ? this.conversation.member1.user : this.conversation.member2.user;
        this.conversationService.getConversationMessage(this.conversationId).subscribe({
          next: (data2: { error: false, messages: MessageI[] }) => {
            this.messages = data2.messages;
            console.log(this.messages);
            this.loading = false;
            this.scrollToBottom();
          },
        });
      },
    });

    this.socketService.newMessage.subscribe({
      next: (data: { content: string, from: string, createdAt: Date, seen: boolean }) => {
        if (data) {
          this.messages.push({ conversationId: this.conversationId, text: data.content, userId: data.from, createdAt: data.createdAt, seen: data.seen });
          this.scrollToBottom();
        }
      }
    });
  }

  sendMessage() {
    if (this.message) {
      this.socketService.sendPrivateMessage(this.conversationId, this.message, { socketId: this.target.socketToken, name: this.target.name });
      this.messages.push({ conversationId: this.conversationId, text: this.message, userId: this.accountService.user.id, createdAt: new Date().toISOString(), seen: true });
      this.message = '';
      this.scrollToBottom();
    }
  }

  updateSeen() {
    this.messages = this.messages.map((message) => {
      message.seen = true;
      return message;
    });
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      this.list.scrollToBottom();
    }, 1);
  }

  nagivateBack() {
    this.location.back();
  }

}
