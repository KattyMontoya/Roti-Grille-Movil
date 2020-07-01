import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
// import { ProductModalPage } from '../product-modal/product-modal.page';
// import { ProductModalPageModule } from '../product-modal/product-modal.module';


@NgModule({
  entryComponents: [
    // ProductModalPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    // ProductModalPageModule,
    ProductsPageRoutingModule
  ],
  declarations: [ProductsPage]
})
export class ProductsPageModule {}
