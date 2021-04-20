import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';

@Component({
  selector: 'app-password-lost',
  templateUrl: './password-lost.page.html',
  styleUrls: ['./password-lost.page.scss'],
})
export class PasswordLostPage implements OnInit {

  public email = '';

  constructor(private router: Router, private authService: AuthService, private toasterService: ToasterService, private loadingController: LoadingController) { }

  ngOnInit() {
  }

  async passwordLost() {
    if (this.email.trim()) {
      const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Vérification...' });
      await loading.present();
      this.authService.passwordRecoveryRequest(this.email.trim()).subscribe({
        next: async () => {
          await loading.dismiss();
          this.router.navigate(['/auth/login']).then(() => {
            this.toasterService.presentSuccessToast('Email envoyé');
          });
        },
        error: async () => {
          await loading.dismiss();
          this.router.navigate(['/auth/login']).then(() => {
            this.toasterService.presentSuccessToast('Email envoyé');
          });
        },
      });
    }
  }

  navigateTo(path: string, id?: string) {
    this.router.navigate([path, id]);
  }

}
