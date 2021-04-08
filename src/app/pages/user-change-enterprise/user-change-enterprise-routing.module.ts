import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserChangeEnterprisePage } from './user-change-enterprise.page';

const routes: Routes = [
  {
    path: '',
    component: UserChangeEnterprisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserChangeEnterprisePageRoutingModule {}
