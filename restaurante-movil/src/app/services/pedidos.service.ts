import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { PedidosI } from '../models/pedidos.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private pedidosCollection: AngularFirestoreCollection<PedidosI>;
  private pedidos: Observable<PedidosI[]>;

  constructor(
    private db: AngularFirestore
  ) { }

  postPedido(data: PedidosI) {
    const id = this.db.createId();
    localStorage.setItem('id_pedido', id);
    data.id = id
    data.fecha = Date.now();

    this.pedidosCollection = this.db.collection<PedidosI>('pedidos');
    return this.pedidosCollection.doc(id).set({ ...data });
  }

  updatePedido(id: string, pedido: PedidosI) {
    this.pedidosCollection = this.db.collection<PedidosI>('pedidos');
    return this.pedidosCollection.doc(id).update(pedido);
  }


  getPedido(id: string) {
    this.pedidosCollection = this.db.collection<PedidosI>('pedidos');
    return this.pedidosCollection.doc<PedidosI>(id).valueChanges();
  }


  getPedidos() {
    console.log('pedidos.service → getPedidos');
    this.pedidosCollection = this.db.collection<PedidosI>(
      'pedidos', ref => ref.where('estado', '==', true));

    const pedidos = this.pedidosCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          // const campo = a.payload.doc.get('tipo');
          // console.log('pedidos.service → getPedidos:', campo);

          // delete data.fecha;
          // delete data.tipo;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
    return pedidos;
  }



}
