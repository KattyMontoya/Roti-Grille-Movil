import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CategoriesI } from '../models/categories.interface';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private categoriesCollection: AngularFirestoreCollection<CategoriesI>;
  private categories: Observable<CategoriesI[]>;


  constructor(
    private db: AngularFirestore
  ) { }

  getCategories() {
    this.categoriesCollection = this.db.collection<CategoriesI>('categorias');

    const categories = this.categoriesCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
    return categories;
  }



}
