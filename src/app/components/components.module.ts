import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AddBtnComponent } from './add-page/add-btn/add-btn.component';
import { ArticleTableComponent } from './table/article-table/article-table.component';
import { ArticleTableRowComponent } from './table/article-table/article-table-row/article-table-row.component';
import { AddBillComponent } from './add-page/add-bill/add-bill.component';
import { AddClientComponent } from './add-page/add-client/add-client.component';
import { AddQuoteComponent } from './add-page/add-quote/add-quote.component';
import { AddEmployeeComponent } from './add-page/add-employee/add-employee.component';
import { AddExpenseComponent } from './add-page/add-expense/add-expense.component';
import { AddProjectComponent } from './add-page/add-project/add-project.component';
import { AddArticleComponent } from './add-page/add-article/add-article.component';
import { AddExpenseAccountComponent } from './add-page/add-expense-account/add-expense-account.component';
import { TimeProjectComponent } from './modals/time-project/time-project.component';
import { CalendarProjectComponent } from './modals/calendar-project/calendar-project.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MglTimelineModule } from 'angular-mgl-timeline';
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
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    MglTimelineModule
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
  ]
})
export class ComponentsModule { }
