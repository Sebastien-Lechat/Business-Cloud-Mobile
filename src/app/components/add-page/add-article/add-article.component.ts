import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ArticleService } from 'src/app/services/article/article.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { ArticleCreateI } from 'src/interfaces/articleInterface';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss'],
})
export class AddArticleComponent implements OnInit {

  name: '';
  description: '';
  price: 0;
  accountNumber = 999999;
  tva = 0;

  constructor(
    private router: Router,
    private articleService: ArticleService,
    private toasterService: ToasterService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() { }

  async createArticle() {
    if (!this.name.trim() || !this.price || !this.accountNumber || !this.tva) {
      this.toasterService.presentErrorToast('Données obligatoires manquantes');
    } else {
      const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Création...' });
      await loading.present();

      const creationData: ArticleCreateI = {
        name: this.name.trim(),
        accountNumber: this.accountNumber,
        price: this.price,
        tva: this.tva,
        description: (this.description.trim()) ? this.description.trim() : '',
      };

      this.articleService.create(creationData).subscribe({
        next: async () => {
          await loading.dismiss();
          this.router.navigate(['/tabs/tab3']).then(() => {
            this.toasterService.presentSuccessToast('Création réussie');
          });
        },
        error: async (error: HttpErrorResponse) => {
          await loading.dismiss();
          if (error.error.code === '106101') { this.toasterService.presentErrorToast('Données obligatoires manquantes'); }
          else if (error.error.code === '106102') { this.toasterService.presentErrorToast('Format du numéro de compte invalide'); }
          else if (error.error.code === '106103') { this.toasterService.presentErrorToast('Format du prix invalide'); }
          else if (error.error.code === '106104') { this.toasterService.presentErrorToast('Format de la tva invalide'); }
          else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
        }
      });
    }
  }

}
