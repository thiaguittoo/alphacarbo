import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdemPageRoutingModule } from './ordem-routing.module';

import { OrdemPage } from './ordem.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OrdemPageRoutingModule
  ],
  declarations: [OrdemPage]
})
export class OrdemPageModule {}
