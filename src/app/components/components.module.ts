import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MglTimelineModule } from 'angular-mgl-timeline';
import { AddArticleComponent } from './add-page/add-article/add-article.component';
import { AddBillComponent } from './add-page/add-bill/add-bill.component';
import { AddBtnComponent } from './add-page/add-btn/add-btn.component';
import { AddClientComponent } from './add-page/add-client/add-client.component';
import { AddEmployeeComponent } from './add-page/add-employee/add-employee.component';
import { AddExpenseAccountComponent } from './add-page/add-expense-account/add-expense-account.component';
import { AddExpenseComponent } from './add-page/add-expense/add-expense.component';
import { AddProjectComponent } from './add-page/add-project/add-project.component';
import { AddQuoteComponent } from './add-page/add-quote/add-quote.component';
import { HeaderComponent } from './header/header.component';
import { LoadBarComponent } from './load-bar/load-bar.component';
import { CalendarProjectComponent } from './modals/calendar-project/calendar-project.component';
import { TimeProjectComponent } from './modals/time-project/time-project.component';
import { ArticleTableRowComponent } from './table/article-table/article-table-row/article-table-row.component';
import { ArticleTableComponent } from './table/article-table/article-table.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ExpenseListComponent } from './modals/expense-list/expense-list.component';
import { UserExpenseListComponent } from './modals/user-expense-list/user-expense-list.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { UserHistoryComponent } from './modals/user-history/user-history.component';
import { PrivatePolicyComponent } from './modals/private-policy/private-policy.component';

@NgModule({
  declarations: [
    HeaderComponent,
    AddBtnComponent,
    ArticleTableComponent,
    ArticleTableRowComponent,
    AddQuoteComponent,
    AddBillComponent,
    AddClientComponent,
    AddEmployeeComponent,
    AddExpenseComponent,
    AddProjectComponent,
    AddArticleComponent,
    AddExpenseAccountComponent,
    TimeProjectComponent,
    CalendarProjectComponent,
    LoadBarComponent,
    ExpenseListComponent,
    UserExpenseListComponent,
    UserHistoryComponent,
    PrivatePolicyComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    MglTimelineModule,
    MatAutocompleteModule,
    NgCircleProgressModule.forRoot(),
  ],
  exports: [
    HeaderComponent,
    AddBtnComponent,
    ArticleTableComponent,
    ArticleTableRowComponent,
    AddQuoteComponent,
    AddBillComponent,
    AddClientComponent,
    AddEmployeeComponent,
    AddExpenseComponent,
    AddProjectComponent,
    AddArticleComponent,
    AddExpenseAccountComponent,
    TimeProjectComponent,
    CalendarProjectComponent,
    LoadBarComponent,
    ExpenseListComponent,
    UserExpenseListComponent,
    UserHistoryComponent,
    PrivatePolicyComponent
  ],
})
export class ComponentsModule { }
