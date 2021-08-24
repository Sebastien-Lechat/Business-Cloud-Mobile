import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowProjectPageRoutingModule } from './show-project-routing.module';

import { ShowProjectPage } from './show-project.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowProjectPageRoutingModule
  ],
  declarations: [ShowProjectPage]
})
export class ShowProjectPageModule { }
