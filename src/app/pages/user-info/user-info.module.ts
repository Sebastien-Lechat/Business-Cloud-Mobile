import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserInfoPageRoutingModule } from './user-info-routing.module';

import { UserInfoPage } from './user-info.page';

import { ImageCropperModule } from 'ngx-image-cropper';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserInfoPageRoutingModule,
    ImageCropperModule,
    NgImageFullscreenViewModule,
  ],
  declarations: [UserInfoPage]
})
export class UserInfoPageModule { }
