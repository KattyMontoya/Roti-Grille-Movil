import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ClienteI } from '../models/cliente.interface';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private clienteCollection: AngularFirestoreCollection<ClienteI>;
  private clientes: Observable<ClienteI[]>;

  constructor(
    private db: AngularFirestore
  ) { }

  getClientes(cedula: string) {
    this.clienteCollection = this.db.collection<ClienteI>(
      'clientes', ref => ref.where('cedula', '==', cedula).where('estado', '==', true));

    const clientes = this.clienteCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
    return clientes;
  }

  postCliente(data: ClienteI) {
    // const id = this.db.createId();
    // data.id = id

    this.clienteCollection = this.db.collection<ClienteI>('clientes');
    return this.clienteCollection.doc(data.id).set({ ...data });
  }
  

  updateCliente(id: string, cliente: ClienteI) {
    this.clienteCollection = this.db.collection<ClienteI>('clientes');
    return this.clienteCollection.doc(id).update(cliente);
  }




}
