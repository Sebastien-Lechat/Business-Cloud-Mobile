import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowExpensePageRoutingModule } from './show-expense-routing.module';

import { ShowExpensePage } from './show-expense.page';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowExpensePageRoutingModule,
    NgImageFullscreenViewModule,
  ],
  declarations: [ShowExpensePage]
})
export class ShowExpensePageModule { }
