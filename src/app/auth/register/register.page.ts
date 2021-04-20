import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public name = '';
  public email = '';
  public phone = '';
  public dateNaissance = '';
  public address = '';
  public zip = '';
  public city = '';
  public country = '';
  public password = '';
  public confirmPassword = '';
  public activity = '';
  public numTVA = '';
  public numSIRET = '';
  public numRCS = '';

  public segment: string;

  constructor(private router: Router, private authService: AuthService, private toasterService: ToasterService, private loadingController: LoadingController) { }

  ngOnInit() {

  }

  async register() {
    const toRegister = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password.trim(),
      birthdayDate: this.dateNaissance.trim(),
      confirmPassword: this.confirmPassword.trim(),
      address: this.address.trim(),
      zip: this.zip.trim(),
      city: this.city.trim(),
      country: this.country.trim(),
      activity: this.activity.trim(),
      numTVA: this.numTVA.trim(),
      numRCS: this.numRCS.trim(),
      numSIRET: this.numSIRET.trim(),
    };

    if (toRegister.name && toRegister.email && toRegister.password && toRegister.confirmPassword) {
      if (this.segment === 'entreprise' && toRegister.numRCS && toRegister.numSIRET && toRegister.numTVA && toRegister.activity) { this.toasterService.presentErrorToast('Champs obligatoires manquants'); }
      else if (toRegister.password !== toRegister.confirmPassword) { this.toasterService.presentErrorToast('Les mots de passe doivent être identiques'); }
      else {
        const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Inscription...' });
        await loading.present();
        this.authService.register(toRegister).subscribe({
          next: async (data: { user: { id: string, email: string } }) => {
            await loading.dismiss();
            this.router.navigate(['/auth/verify-email'], { state: { email: data.user.email } }).then(() => {
              this.toasterService.presentSuccessToast('Inscription réussie');
              this.authService.verifyEmailRequest(data.user.email).subscribe({
                error: () => this.toasterService.presentErrorToast('Erreur lors de l\'envoi de l\'email'),
              });
            });
          },
          error: async (error: HttpErrorResponse) => {
            await loading.dismiss();
            if (error.error.code === '101052') { this.toasterService.presentErrorToast('Adresse email invalide'); }
            else if (error.error.code === '101053') { this.toasterService.presentErrorToast('Numéro de téléphone invalide'); }
            else if (error.error.code === '101054') { this.toasterService.presentErrorToast('Mot de passe à trop faible sécurité'); }
            else if (error.error.code === '101055') { this.toasterService.presentErrorToast('Numéro de TVA invalide'); }
            else if (error.error.code === '101056') { this.toasterService.presentErrorToast('Numéro de SIRET invalide'); }
            else if (error.error.code === '101057') { this.toasterService.presentErrorToast('Numéro RCS invalide'); }
            else if (error.error.code === '101058') { this.toasterService.presentErrorToast('Format de date anniversaire invalide'); }
            else if (error.error.code === '101059') { this.toasterService.presentErrorToast('Un compte existe déjà à cette addresse mail'); }
            else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
          },
        });
      }
    } else { this.toasterService.presentErrorToast('Champs obligatoires manquants'); }
  }

  navigateTo(path: string, id?: string) {
    this.router.navigate([path, id]);
  }

  segmentChanged(event) {
    this.segment = event.detail.value;
  }
}
