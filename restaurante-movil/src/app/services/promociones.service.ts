import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { firestore } from 'firebase';
import { PromocionesI } from '../models/promociones.interface';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  private promocionesCollection: AngularFirestoreCollection<PromocionesI>;
  private promociones: Observable<PromocionesI[]>;

  constructor(
    private db: AngularFirestore
  ) { }

  getPromociones() {
    console.log('promociones.service → getpromociones');
    this.promocionesCollection = this.db.collection<PromocionesI>(
      'promociones', ref => ref.where('estado', '==', true));

    const promociones = this.promocionesCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
    return promociones;
  }


  getPromociones_FilterDate(fechaI: any, fechaF: any) {
    console.log('promociones.service → getPromociones_FilterDate');
    this.promocionesCollection = this.db.collection<PromocionesI>(
      'promociones', ref => ref.where('time', '>', fechaI).where('time', '<', fechaF));

    const promociones = this.promocionesCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
    return promociones;
  }




}
