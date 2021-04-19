import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.page.html',
  styleUrls: ['./email-verify.page.scss'],
})
export class EmailVerifyPage implements OnInit {

  public email = '';

  public code = '';

  public one = '';
  public two = '';
  public three = '';
  public four = '';
  public five = '';
  public six = '';

  constructor(private router: Router, private authService: AuthService, private toasterService: ToasterService, private loadingController: LoadingController) {
    if (!this.router.getCurrentNavigation().extras.state) {
      this.navigateTo('/auth/login');
    } else {
      if (this.router.getCurrentNavigation().extras.state.email) { this.email = this.router.getCurrentNavigation().extras.state.email; }
    }
  }

  ngOnInit() {
  }

  changeInputCode(value: string, index: number) {
    if (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 9) {
      this.code = this.one + this.two + this.three + this.four + this.five + this.six;
      if (value.length === 1 && index !== 6) {
        document.getElementById((index + 1).toString()).focus();
      } else {
        this.verifyEmail();
      }
    } else {
      switch (index) {
        case 1: this.one = ''; break;
        case 2: this.two = ''; break;
        case 3: this.three = ''; break;
        case 4: this.four = ''; break;
        case 5: this.five = ''; break;
        case 6: this.six = ''; break;
      }
    }
  }

  async verifyEmail() {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Vérification...' });
    await loading.present();
    this.authService.verifyEmail(this.email, this.code).subscribe({
      next: async () => {
        await loading.dismiss();
        this.router.navigate(['/auth/login']).then(() => {
          this.toasterService.presentSuccessToast('Vérification réussie');
        });
      },
      error: async (error: HttpErrorResponse) => {
        await loading.dismiss();
        if (error.error.code === '101205') { this.toasterService.presentErrorToast('Le code saisi est invalide'); }
        else if (error.error.code === '101206') { this.toasterService.presentErrorToast('Le code saisi est n\'est plus valide'); }
        else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
      },
    });
  }

  sendVerifyEmailCode() {
    this.authService.verifyEmailRequest(this.email).subscribe({
      next: () => this.toasterService.presentSuccessToast('Email envoyé'),
      error: () => this.toasterService.presentErrorToast('Erreur lors de l\'envoi de l\'email'),
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

}
