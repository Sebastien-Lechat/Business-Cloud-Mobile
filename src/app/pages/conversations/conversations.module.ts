import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConversationsPageRoutingModule } from './conversations-routing.module';

import { ConversationsPage } from './conversations.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConversationsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ConversationsPage]
})
export class ConversationsPageModule { }
