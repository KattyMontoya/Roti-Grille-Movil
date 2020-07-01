import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroCategoria'
})
export class FiltroCategoriaPipe implements PipeTransform {

  transform(arreglo: any, texto: string): any[] {

    if (texto === '') {
      return arreglo;
    }
    texto = texto.toLowerCase();
    return arreglo.filter(categoria => {
      return categoria.nombre.toLowerCase().includes(texto);
    });
  }



}
