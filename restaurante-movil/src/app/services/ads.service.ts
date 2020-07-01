import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AdsI } from '../models/ads.interface';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { InicioI } from '../models/inicio.interface';


@Injectable({
  providedIn: 'root'
})
export class AdsService {

  private adsCollection: AngularFirestoreCollection<AdsI>;
  private ads: Observable<AdsI[]>;

  private inicioCollection: AngularFirestoreCollection<InicioI>;

  constructor(
    private db: AngularFirestore
  ) {
    // this.adsCollection = this.db.collection<AdsI>(
    //   'publicidad', ref => ref.where('categoria', '==', id_categoria));

    // this.ads = this.adsCollection.snapshotChanges().pipe(map(
    //   actions => {
    //     return actions.map(a => {
    //       const data = a.payload.doc.data();
    //       const id = a.payload.doc.id;
    //       return { id, ...data }; 
    //     });
    //   }
    // ));

  }

  getAds_home() {
    this.adsCollection = this.db.collection<AdsI>(
      'publicidad', ref => ref.where('estado', '==', false));

    const adds = this.adsCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
    return adds;
  }

  getAds_categorias() {
    this.adsCollection = this.db.collection<AdsI>(
      'publicidad', ref => ref.where('estado', '==', true));

    const adds = this.adsCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
    return adds;
  }

  getAds_home_restaurante() {
    this.inicioCollection = this.db.collection<InicioI>(
      'inicio',
      ref => ref.where('estado', '==', true)
        .where('plataforma', '==', 'Móvil')
    );

    const adds = this.inicioCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
    return adds;
  }




}
