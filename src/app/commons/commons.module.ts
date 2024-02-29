import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TabsComponent } from './tabs/tabs.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    HeaderComponent,
    TabsComponent,
  ],
  exports: [
    HeaderComponent,
    TabsComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
  ]
})
export class CommonsModule { }
