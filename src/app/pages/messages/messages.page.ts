import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AccountService } from 'src/app/services/account/account.service';
import { ConversationService } from 'src/app/services/conversation/conversation.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { SocketService } from 'src/app/services/global/socket.service';
import { ConvJsonI, MessageI } from 'src/interfaces/conversationInterface';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit, OnDestroy {

  conversationId: string;
  conversation: ConvJsonI;

  messages: MessageI[] = [];
  message = '';
  newIsPrinted = false;

  target: { _id: string, name: string, socketToken: string, isConnected?: boolean };

  loading = false;
  interval: any;

  @ViewChild('list') list: IonContent;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    private socketService: SocketService,
    private globalService: GlobalService,
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
            this.loading = false;
            this.startCheckConnected();
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

    this.socketService.isConnected.subscribe({
      next: (data: { value: boolean, from: { name: string, socketId: string } }) => {
        if (data && this.target && this.target?.socketToken === data?.from.socketId) {
          this.target.isConnected = data.value;
        }
      }
    });

    window.addEventListener('keyboardDidShow', () => {
      this.updateSeen();
    });

    window.addEventListener('keyboardDidHide', () => {
      this.updateSeen();
    });
  }

  sendMessage() {
    if (this.message) {
      this.socketService.sendPrivateMessage(this.conversationId, this.message, { id: this.target._id, socketId: this.target.socketToken, name: this.target.name });
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

  startCheckConnected() {
    this.socketService.checkIfConnected({ socketId: this.target.socketToken, name: this.target.name });
    this.interval = setInterval(() => {
      this.socketService.checkIfConnected({ socketId: this.target.socketToken, name: this.target.name });
    }, 10000);
  }

  scrollToBottom() {
    setTimeout(() => {
      this.list.scrollToBottom();
    }, 2);
  }

  nagivateBack() {
    this.globalService.closeConv.next(true);
    this.location.back();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

}
