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
  isConnected: BehaviorSubject<{ value: boolean, from: { name: string, socketId: string } }> = new BehaviorSubject(undefined);

  constructor(private accountService: AccountService) { }

  connect() {
    if (!this.socketConnected) {
      const user = this.accountService.user;
      this.socket = io(environment.SOCKET, { path: '/socketio', auth: { token: `Bearer ${user.token}` } });

      if (this.socket) {
        this.socketConnected = true;
        this.socket.connect();
      }

      this.socket.on('private message', (data: { content: string, from: string, createdAt: Date, seen: boolean }) => {
        // console.log('Receiving message...');
        this.newMessage.next({ content: data.content, from: data.from, createdAt: data.createdAt, seen: data.seen });
      });

      this.socket.on('check connected', (data: { value: boolean, from: { name: string, socketId: string } }) => {
        // console.log('Check connexion received...');
        this.isConnected.next(data);
      });

      this.socket.on('connect_error', (error: any) => {
        console.log(error);
      });
    }
  }

  sendPrivateMessage(conversationId: string, content: string, to: { id: string, socketId: string, name: string }) {
    // console.log('Sending message...');
    if (this.socket) { this.socket.emit('private message', { conversationId, content, to }); }
  }

  checkIfConnected(to: { socketId: string, name: string }) {
    // console.log('Check connexion...');
    if (this.socket) { this.socket.emit('check connected', { to }); }
  }

  disconnect() {
    console.log('Déconnexion...');
    this.socketConnected = false;
    this.socket.disconnect();
  }
}
