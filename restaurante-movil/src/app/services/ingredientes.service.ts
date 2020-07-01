import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CategoriesI } from '../models/categories.interface';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { RecetaI } from '../models/receta.interface';

@Injectable({
  providedIn: 'root'
})
export class IngredientesService {

  private recetasCollection: AngularFirestoreCollection<RecetaI>;
  private recetas: Observable<RecetaI[]>;

  constructor(
    private db: AngularFirestore
  ) { }

  getRecetas(id_producto: string) {
    this.recetasCollection = this.db.collection<RecetaI>(
      'receta', ref => ref.where('iPlato', '==', id_producto));

    const recetas = this.recetasCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
    return recetas;
  }


  
  getReceta(id_receta: string) {
    this.recetasCollection = this.db.collection<RecetaI>(
      'receta', ref => ref.where('id', '==', id_receta));

    const recetas = this.recetasCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
    return recetas;
  }




}
