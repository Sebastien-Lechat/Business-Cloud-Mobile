import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  getConversationList() {
    return this.http.get<any>(this.url + `conversations`);
  }

  getConversation(conversationId: string) {
    return this.http.get<any>(this.url + `conversation/` + conversationId);
  }

  getConversationMessage(conversationId: string) {
    return this.http.get<any>(this.url + `conversation/` + conversationId + `/messages`);
  }

  create(userId: string) {
    return this.http.post<any>(this.url + `conversation`, { userId });
  }
}
