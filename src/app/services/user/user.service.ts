import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = environment.API;

  constructor(private http: HttpClient) { }

  getUsersList() {
    return this.http.get<any>(this.url + `users`);
  }

  getUser(id: string) {
    return this.http.get<any>(this.url + `user/` + id);
  }

  getUserHistory(id: string) {
    return this.http.get<any>(this.url + `user/history/` + id);
  }

  getActionType(method: string, route: string) {
    if (route.includes('/article')) {
      if (method === 'POST') { return 'Création d\'un article'; }
      else if (method === 'DELETE') { return 'Suppression d\'un article'; }
    } else if (route.includes('/bill')) {
      if (method === 'POST') { return 'Création d\'une facture'; }
      else if (method === 'PUT') { return 'Modification d\'une facture'; }
      else if (method === 'DELETE') { return 'Suppression d\'une facture'; }
    } else if (route.includes('/estimate')) {
      if (method === 'POST') { return 'Création d\'un devis'; }
      else if (method === 'PUT') { return 'Modification d\'un devis'; }
      else if (method === 'DELETE') { return 'Suppression d\'un devis'; }
    } else if (route.includes('/customer')) {
      if (method === 'POST') { return 'Création d\'un client'; }
      else if (method === 'PUT') { return 'Modification d\'un client'; }
      else if (method === 'DELETE') { return 'Suppression d\'un client'; }
    } else if (route.includes('/employee')) {
      if (method === 'POST') { return 'Création d\'un employé'; }
      else if (method === 'PUT') { return 'Modification d\'un employé'; }
      else if (method === 'DELETE') { return 'Suppression d\'un employé'; }
    } else if (route.includes('/expense')) {
      if (method === 'POST') { return 'Création d\'une dépense'; }
      else if (method === 'DELETE') { return 'Suppression d\'une dépense'; }
    } else if (route.includes('/project')) {
      if (method === 'POST') { return 'Création d\'un projet'; }
      else if (method === 'PUT') { return 'Modification d\'un projet'; }
      else if (method === 'DELETE') { return 'Suppression d\'un projet'; }
    } else if (route.includes('/task')) {
      if (method === 'POST') { return 'Création d\'une tâche'; }
      else if (method === 'DELETE') { return 'Suppression d\'une tâche'; }
    } else if (route.includes('/time')) {
      if (method === 'POST') { return 'Création d\'un temps'; }
      else if (method === 'PUT') { return 'Modification d\'un temps'; }
      else if (method === 'DELETE') { return 'Suppression d\'un temps'; }
    } else if (route.includes('/expense-employee')) {
      if (method === 'POST') { return 'Création d\'une note de frais'; }
      else if (method === 'DELETE') { return 'Suppression d\'une note de frais'; }
    }
  }

}
