import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { FacebookDataI, GoogleDataI } from 'src/interfaces/globalInterface';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email = '';
  public password = '';

  public loading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toasterService: ToasterService,
    private loadingController: LoadingController
  ) { }

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

  async facebookLogin() {
    const { request, token } = await this.authService.loginToFacebook();
    if (!request) {
      this.toasterService.presentErrorToast('Connexion à Facebook impossible');
    } else {
      request.subscribe({
        next: async (data: FacebookDataI) => {
          const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Vérification...' });
          await loading.present();
          this.authService.externalLogin('facebook', data.id, data.email, token).subscribe({
            next: async () => {
              await loading.dismiss();
              this.router.navigate(['/tabs/tab3']);
            },
            error: async (error: HttpErrorResponse) => {
              await loading.dismiss();
              if (error.error.code === '101401') { this.toasterService.presentErrorToast('Erreur lors de la connexion'); }
              else if (error.error.code === '101402') { this.toasterService.presentErrorToast('Adresse email invalide'); }
              else if (error.error.code === '101403') {
                this.router.navigate(['/auth/register'], { state: { email: data.email, name: data.name, avatar: data.picture.data.url, birthday: data.birthday, facebookAuth: { id: data.id, token } } }).then(() => {
                  this.toasterService.presentSuccessToast('Connexion réussie, compléter votre compte avec les informations nécessaires.');
                });
              }
              else if (error.error.code === '101405') { this.toasterService.presentErrorToast('Un compte existe déjà à cette addresse'); }
              else if (error.error.code === '101406') { this.toasterService.presentErrorToast('Compte de connexion invalide'); }
              else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
            },
          });
        },
        error: () => {
          this.toasterService.presentErrorToast('Connexion à Facebook impossible');
        }
      });
    }
  }

  async googleLogin() {
    (await this.authService.loginToGoogle()).subscribe({
      next: async (data: GoogleDataI) => {
        const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Vérification...' });
        await loading.present();
        this.authService.externalLogin('google', data.id, data.email, data.idToken).subscribe({
          next: async () => {
            await loading.dismiss();
            this.router.navigate(['/tabs/tab3']);
          },
          error: async (error: HttpErrorResponse) => {
            console.log(error.error.code);
            await loading.dismiss();
            if (error.error.code === '101401') { this.toasterService.presentErrorToast('Erreur lors de la connexion'); }
            else if (error.error.code === '101402') { this.toasterService.presentErrorToast('Adresse email invalide'); }
            else if (error.error.code === '101403') {
              this.router.navigate(['/auth/register'], { state: { id: data.id, email: data.email, avatar: data.imageUrl, name: data.familyName + ' ' + data.givenName, googleAuth: { id: data.id, token: data.idToken } } }).then(() => {
                this.toasterService.presentSuccessToast('Connexion réussie, compléter votre compte avec les informations nécessaires.');
              });
            }
            else if (error.error.code === '101405') { this.toasterService.presentErrorToast('Un compte existe déjà à cette addresse'); }
            else if (error.error.code === '101406') { this.toasterService.presentErrorToast('Compte de connexion invalide'); }
            else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
          },
        });
      },
      error: () => {
        this.toasterService.presentErrorToast('Connexion à Google impossible');
      }
    });
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }
}
