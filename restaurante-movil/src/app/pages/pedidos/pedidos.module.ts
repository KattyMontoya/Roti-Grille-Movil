import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosPageRoutingModule } from './pedidos-routing.module';

import { PedidosPage } from './pedidos.page';
import { ClientePage } from '../cliente/cliente.page';
import { ClientePageModule } from '../cliente/cliente.module';

@NgModule({
  entryComponents: [
    ClientePage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientePageModule,
    ReactiveFormsModule,
    PedidosPageRoutingModule
  ],
  declarations: [PedidosPage]
})
export class PedidosPageModule { }
