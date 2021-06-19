import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client/build/index';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;
  socketConnected = false;

  newMessage: BehaviorSubject<{ content: string, from: string, createdAt: Date, seen: boolean }> = new BehaviorSubject(undefined);

  constructor(private accountService: AccountService) { }

  connect() {
    const user = this.accountService.user;
    this.socket = io(environment.SOCKET, { path: '/socketio', auth: { token: `Bearer ${user.token}` } });

    if (!this.socketConnected) {
      console.log('Connexion...1');
      if (this.socket) {
        console.log('Connexion...2');
        this.socketConnected = true;
        this.socket.connect();
      }

      this.socket.on('private message', (data: { content: string, from: string, createdAt: Date, seen: boolean }) => {
        console.log('Receiving message...');
        this.newMessage.next({ content: data.content, from: data.from, createdAt: data.createdAt, seen: data.seen });
      });

      this.socket.on('connect_error', (error: any) => {
        console.log(error);
      });
    }
  }

  sendPrivateMessage(conversationId: string, content: string, to: { socketId: string, name: string }) {
    console.log('Sending message...');
    this.socket.emit('private message', { conversationId, content, to });
  }

  disconnect() {
    console.log('Déconnexion...');
    this.socketConnected = false;
    this.socket.disconnect();
  }
}
