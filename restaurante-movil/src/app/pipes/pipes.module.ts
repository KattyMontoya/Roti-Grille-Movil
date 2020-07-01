import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroCategoriaPipe } from './filtro-categoria.pipe';
import { FiltroProductoPipe } from './filtro-producto.pipe';


@NgModule({
  declarations: [
    FiltroCategoriaPipe,
    FiltroProductoPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FiltroCategoriaPipe,
    FiltroProductoPipe
  ]
})
export class PipesModule { }
