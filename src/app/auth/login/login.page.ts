import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email = '';
  public password = '';

  public loading = false;

  constructor(private router: Router, private authService: AuthService, private toasterService: ToasterService, private loadingController: LoadingController) { }

  ngOnInit() {
  }

  async login() {
    if (this.email && this.password) {
      const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Connexion...' });
      await loading.present();
      const userEmail = this.email.trim();
      const userPassword = this.password.trim();
      this.authService.login(userEmail, userPassword).subscribe({
        next: async () => {
          await loading.dismiss();
          this.router.navigate(['/tabs/tab3']);
        },
        error: async (error: HttpErrorResponse) => {
          await loading.dismiss();
          if (error.error.code === '101002') { this.toasterService.presentErrorToast('Adresse email invalide'); }
          else if (error.error.code === '101003') { this.toasterService.presentErrorToast('Information de connexion invalide'); }
          else if (error.error.code === '101004') {
            this.router.navigate(['/auth/verify-email'], { state: { email: userEmail } }).then(() => {
              this.authService.verifyEmailRequest(userEmail).subscribe({
                error: () => this.toasterService.presentErrorToast('Erreur lors de l\'envoi de l\'email'),
              });
            });
          }
          else if (error.error.code === '101005') {
            this.router.navigate(['/auth/double-auth'], { state: { email: userEmail, password: userPassword } }).then(() => {
              this.authService.doubleAuthentificationRequest(userEmail, userPassword).subscribe({
                error: () => this.toasterService.presentErrorToast('Erreur lors de l\'envoi de l\'email'),
              });
            });
          }
          else if (error.error.code === '101008') { this.toasterService.presentErrorToast('Information de connexion invalide'); }
          else if (error.error.code === '101009') { this.toasterService.presentErrorToast('Trop de tentative de connexion, veuillez attendre 5min avant de réassayer'); }
          else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
        },
        complete: async () => {
          await loading.dismiss();
          this.router.navigate(['/tabs/tab3']);
        },
      });
    } else { this.toasterService.presentErrorToast('Email ou mot de passe manquants'); }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
