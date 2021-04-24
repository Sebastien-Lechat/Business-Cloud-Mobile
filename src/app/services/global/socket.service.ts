import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client/build/index';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socketConnected = false;
  private socket: Socket;

  constructor(private accountService: AccountService) { }

  connect() {
    const user = this.accountService.user;
    this.socket = io(environment.SOCKET, { path: '/socketio', auth: { token: `Bearer ${user.token}` } });

    if (!this.socketConnected) {
      if (this.socket) {
        this.socketConnected = true;
        this.socket.connect();
      }

      this.socket.on('connection', () => {
        console.log(3);
      });

      this.socket.on('connect_error', (error: any) => {
        console.log(error);
      });
    }
  }

  disconnect() {
    this.socket.disconnect();
    this.socketConnected = false;
  }
}
