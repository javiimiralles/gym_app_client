import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';

import { UserModule } from './user/user.module';
import { CommonsModule } from '../commons/commons.module';

@NgModule({
  declarations: [
    AdminLayoutComponent,
  ],
  exports: [
    AdminLayoutComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    UserModule,
    CommonsModule
  ]
})
export class PagesModule { }
