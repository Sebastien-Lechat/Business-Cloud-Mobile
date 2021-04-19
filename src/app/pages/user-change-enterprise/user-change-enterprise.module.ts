import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserChangeEnterprisePageRoutingModule } from './user-change-enterprise-routing.module';

import { UserChangeEnterprisePage } from './user-change-enterprise.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserChangeEnterprisePageRoutingModule
  ],
  declarations: [UserChangeEnterprisePage]
})
export class UserChangeEnterprisePageModule {}
