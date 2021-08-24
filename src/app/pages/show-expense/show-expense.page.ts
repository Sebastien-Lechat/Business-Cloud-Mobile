import { formatDate, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { ToasterService } from 'src/app/services/toaster/toaster.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserExpenseService } from 'src/app/services/userExpense/user-expense.service';
import { testData, TArticles } from 'src/interfaces/articles-type';
import { ExpenseJsonI } from 'src/interfaces/expenseInterface';
import { UserExpenseJsonI } from 'src/interfaces/userExpense';
import { ClientI } from 'src/interfaces/userInterface';
@Component({
  selector: 'app-show-expense',
  templateUrl: './show-expense.page.html',
  styleUrls: ['./show-expense.page.scss'],
})
export class ShowExpensePage implements OnInit {

  id = '';
  expense: any;
  employee: ClientI;
  count = 0;
  fileImg: any;
  showFlag = false;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private expenseService: ExpenseService,
    private userService: UserService,
    private loadingController: LoadingController,
    private toasterService: ToasterService,
    private userExpenseService: UserExpenseService,
    private afStorage: AngularFireStorage
  ) { }

  articles: Array<TArticles> = testData;

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) { this.initData(); }
  }

  async initData() {
    const loading = await this.loadingController.create({ cssClass: 'loading-div', message: 'Récupération...' });
    await loading.present();
    this.expenseService.getOneExpense(this.id).subscribe({
      next: async (data: { error: false, expense: ExpenseJsonI }) => {
        data.expense.createdAt = formatDate(data.expense.createdAt, 'yyyy-MM-dd', 'fr-FR', 'Europe/France');
        this.expense = data.expense;
        this.loadImg(this.expense.file);
        this.userService.getUser(this.expense.userId).subscribe({
          next: async (data2: { error: false, user: ClientI }) => {
            this.employee = data2.user;
            await loading.dismiss();
          }
        });
      },
      error: async (error: HttpErrorResponse) => {
        await loading.dismiss();
        this.errorCount(this.count += 1, error);
      }
    });

    this.userExpenseService.getOneUserExpense(this.id).subscribe({
      next: async (data: { error: false, expense: UserExpenseJsonI }) => {
        data.expense.createdAt = formatDate(data.expense.createdAt, 'yyyy-MM-dd', 'fr-FR', 'Europe/France');
        this.expense = data.expense;
        this.userService.getUser(this.expense.userId).subscribe({
          next: async (data2: { error: false, user: ClientI }) => {
            this.employee = data2.user;
            await loading.dismiss();
          }
        });
      },
      error: async (error: HttpErrorResponse) => {
        await loading.dismiss();
        this.errorCount(this.count += 1, error);
      }
    });
  }

  errorCount(count: number, error: HttpErrorResponse) {
    if (count === 2) {
      this.toasterService.presentErrorToast('Impossible de récupérer cette dépense.', { error });
    }
  }

  navigateTo(path: string, id?: string) {
    if (id) { this.router.navigate([path, id]); }
    else { this.router.navigate([path]); }
  }

  nagivateBack() {
    this.location.back();
  }

  showLightbox() {
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
  }

  loadImg(path: string) {
    const ref = this.afStorage.ref('images/' + path);
    ref.getDownloadURL().subscribe({
      next: (data: any) => {
        this.fileImg = data;
      }
    });
  }

}
