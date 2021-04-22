import { formatDate, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ArticleService } from 'src/app/services/article/article.service';
import { BillService } from 'src/app/services/bill/bill.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { UserService } from 'src/app/services/user/user.service';
import { ArticleI } from 'src/interfaces/articleInterface';
import { BillI } from 'src/interfaces/billInterface';
import { UserJsonI } from 'src/interfaces/userInterface';

@Component({
  selector: 'app-show-bill',
  templateUrl: './show-bill.page.html',
  styleUrls: ['./show-bill.page.scss'],
})
export class ShowBillPage implements OnInit {

  id = '';
  bill: BillI;
  client: UserJsonI;

  articlesList: ArticleI[] = [];
  filteredArticlesList: ArticleI[] = [];

  selectedArticle = { name: '', selectedId: '', quantity: 0, tva: 0, price: 0, description: '', accountNumber: 999999 };

  edit = true;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private billService: BillService,
    private userService: UserService,
    private articleService: ArticleService,
    private loadingController: LoadingController,
    private toasterService: ToasterService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) { this.initData(); }
    this.initAutocomplete();
  }

  async initData() {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Récupération...' });
    await loading.present();
    this.billService.getOneBill(this.id).subscribe({
      next: (data: { error: false, bill: BillI }) => {
        data.bill.createdAt = formatDate(data.bill.createdAt, 'yyyy-MM-dd', 'fr-FR', 'Europe/France');
        data.bill.deadline = formatDate(data.bill.deadline, 'yyyy-MM-dd', 'fr-FR', 'Europe/France');
        this.bill = data.bill;
        this.userService.getUser(this.bill.clientId as string).subscribe({
          next: async (data2: { error: false, user: UserJsonI }) => {
            this.client = data2.user;
            await loading.dismiss();
          }
        });
      }
    });
  }

  initAutocomplete() {
    this.articleService.getArticleList().subscribe({
      next: (data: { error: false, articles: ArticleI[] }) => {
        this.articlesList = data.articles;
        this.filteredArticlesList = data.articles;
      },
    });
  }

  filterArticle(event?: any) {
    if (event) {
      this.selectedArticle.selectedId = event.option.value;
      this.articlesList.map(article => {
        if (article.id === event.option.value) {
          this.selectedArticle.name = article.name;
          this.selectedArticle.tva = article.tva;
          this.selectedArticle.quantity = 1;
          this.selectedArticle.price = article.price;
          this.selectedArticle.description = (article.description) ? article.description : '';
        }
      });
    } else {
      this.selectedArticle.selectedId = '';
      this.filteredArticlesList = this.articlesList.filter(article => {
        if (article.name.toLocaleLowerCase().includes(this.selectedArticle.name.toLocaleLowerCase())) { return true; }
      });
    }
  }

  async updateBillArticles() {
    const findArticle = this.articlesList.find(article => {
      return this.selectedArticle.selectedId === article.id
        && this.selectedArticle.name === article.name
        && this.selectedArticle.tva === article.tva
        && this.selectedArticle.price === article.price
        && (!article.description || this.selectedArticle.description === article.description);
    }) || undefined;

    if (!findArticle) {
      if (!this.selectedArticle.name || !this.selectedArticle.tva || !this.selectedArticle.price || !this.selectedArticle.accountNumber || !this.selectedArticle.quantity) {
        this.toasterService.presentErrorToast('Données obligatoires manquantes');
      } else {
        const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Ajout...' });
        await loading.present();
        this.articleService.create(this.selectedArticle).subscribe({
          next: (data: { error: false, article: ArticleI }) => {
            this.billService.update({ id: this.bill.id, articles: this.generateArticleUpdateList((data.article._id) ? data.article._id : data.article.id) }).subscribe({
              next: async (data2: { error: false, bill: BillI }) => {
                this.bill = data2.bill;
                this.selectedArticle = { name: '', selectedId: '', quantity: 0, tva: 0, price: 0, description: '', accountNumber: 999999 };
                await loading.dismiss();
                this.toasterService.presentSuccessToast('Article ajouté à la facture');
              },
              error: async (error: HttpErrorResponse) => {
                await loading.dismiss();
                if (error.error.code === '104201') { this.toasterService.presentErrorToast('ID de la facture manquant'); }
                else if (error.error.code === '104207') { this.toasterService.presentErrorToast('Format d\'article invalide'); }
                else if (error.error.code === '104208') { this.toasterService.presentErrorToast('Certains ID d\'articles sont invalides'); }
                else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
              }
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
    } else {
      this.updateBill(this.generateArticleUpdateList(this.selectedArticle.selectedId), 'Ajout...', 'Article ajouté à la facture');
    }
  }

  async deleteBill() {
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      message: 'Êtes-vous sur de vouloir supprimer cette facture ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Confirmer',
          role: 'confirm',
          handler: async () => {
            const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Suppression...' });
            await loading.present();
            this.billService.delete(this.bill.id).subscribe({
              next: async () => {
                await loading.dismiss();
                this.router.navigate(['/tabs/tab2']).then(() => {
                  this.toasterService.presentSuccessToast('Suppression de la facture réussie');
                });
              },
              error: async (error: HttpErrorResponse) => {
                await loading.dismiss();
                if (error.error.code === '104251') { this.toasterService.presentErrorToast('ID de la facture manquant'); }
                else if (error.error.code === '104252') { this.toasterService.presentErrorToast('ID de la facture invalide'); }
                else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteArticle(i: number) {
    const articles: { articleId: string, quantity: number }[] = [];
    this.bill.articles.map((article, index: number) => {
      if (index !== i) { articles.push({ articleId: (article.articleId._id) ? article.articleId._id : article.articleId.id, quantity: article.quantity }); }
    });

    this.updateBill(articles, 'Suppression...', 'Article supprimé de la facture');
  }

  generateArticleUpdateList(id: string) {
    const articles: { articleId: string, quantity: number }[] = [];
    this.bill.articles.map(article => {
      articles.push({ articleId: (article.articleId._id) ? article.articleId._id : article.articleId.id, quantity: article.quantity });
    });
    articles.push({ articleId: id, quantity: this.selectedArticle.quantity });
    return articles;
  }

  async updateBill(articleList: { articleId: string, quantity: number }[], loadingText: string, toasterText: string) {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: loadingText });
    await loading.present();
    this.billService.update({ id: this.bill.id, articles: articleList }).subscribe({
      next: async (data: { error: false, bill: BillI }) => {
        this.bill = data.bill;
        this.selectedArticle = { name: '', selectedId: '', quantity: 0, tva: 0, price: 0, description: '', accountNumber: 999999 };
        await loading.dismiss();
        this.toasterService.presentSuccessToast(toasterText);
      },
      error: async (error: HttpErrorResponse) => {
        await loading.dismiss();
        if (error.error.code === '104201') { this.toasterService.presentErrorToast('ID de la facture manquant'); }
        else if (error.error.code === '104207') { this.toasterService.presentErrorToast('Format d\'article invalide'); }
        else if (error.error.code === '104208') { this.toasterService.presentErrorToast('Certains ID d\'articles sont invalides'); }
        else { this.toasterService.presentErrorToast('Erreur interne au serveur', { error }); }
      }
    });
  }

  sendMail() {
    this.toasterService.presentSuccessToast('Email envoyé');
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }

  nagivateBack() {
    this.location.back();
  }

}
