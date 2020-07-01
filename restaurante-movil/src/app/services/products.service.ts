import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CategoriesI } from '../models/categories.interface';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { ProductsI } from '../models/products.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productsCollection: AngularFirestoreCollection<ProductsI>;
  private products: Observable<ProductsI[]>;

  constructor(
    private db: AngularFirestore
  ) { }

  getProducts(id_categoria: string) {
    this.productsCollection = this.db.collection<ProductsI>(
      'productos', ref => ref.where('categoria', '==', id_categoria).where('estado', '==', true));

    const products = this.productsCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
    return products;
  }

  



}
