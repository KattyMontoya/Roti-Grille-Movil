import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SugerenciasI } from '../models/sugerencias.interface';
// import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class SugerenciasService {

  private sugerenciaCollection: AngularFirestoreCollection<SugerenciasI>;
  private sugerencias: Observable<SugerenciasI[]>;

  constructor(
    private db: AngularFirestore
  ) { }

  postSugerencia(data: SugerenciasI) {
    console.log('sugerencias.service → postSugerencia');
    const id = this.db.createId();
    data.id = id

    this.sugerenciaCollection = this.db.collection<SugerenciasI>('quejas_sugerencias');
    return this.sugerenciaCollection.doc(data.id).set({ ...data });
  }

}
