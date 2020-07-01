import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase';
import { MesaI } from '../models/mesa.interface';

import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';


@Injectable({
  providedIn: 'root'
})
export class MesaService {

  private mesasCollection: AngularFirestoreCollection<MesaI>;
  private mesas: Observable<MesaI[]>;

  constructor(
    private db: AngularFirestore,
    private uid: Uid,
    private androidPermissions: AndroidPermissions,
    private uniqueDeviceID: UniqueDeviceID
  ) { }

  postMesa(data: MesaI) {
    const id = this.db.createId();
    data.id = id
    this.mesasCollection = this.db.collection<MesaI>('mesas');
    return this.mesasCollection.doc(id).set({ ...data });
  }

  updateMesa(id: string, mesa: MesaI) {

    this.mesasCollection = this.db.collection<MesaI>('mesas');
    return this.mesasCollection.doc(id).update(mesa);
  }


  getMesa(id: string) {

    this.mesasCollection = this.db.collection<MesaI>('mesas');
    return this.mesasCollection.doc<MesaI>(id).valueChanges();
  }


  getMesas(uid_mesa: string) {

    console.log('mesas.service → getmesas');
    this.mesasCollection = this.db.collection<MesaI>(
      'mesas', ref => ref.where('uid_mesa', '==', uid_mesa).where('estado', '==', true));

    const mesas = this.mesasCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
    return mesas;
  }


  async getImei() {

    const { hasPermission } = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );

    if (!hasPermission) {
      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );

      if (!result.hasPermission) {
        alert('Permissions required');
        throw new Error('Permissions required');
      }

      // ok, a user gave us permission, we can get him identifiers after restart app
      return;
    }

    return this.uid.IMEI
  }

  async onMesaNumber() {
    await this.getImei().then(imei => {
      console.log('IMEI 1:', imei);
      alert('imei1:' + imei);
      alert('UID_IMEI:' + this.uid.IMEI);
      if (imei) {
        alert('imei:' + imei);
        localStorage.setItem('uid_mesa', imei);
        this.getMesas(imei).subscribe(data => {
          alert('data:' + data.length);
          const mesa = {
            id: '',
            nombre: 'mesa',
            numero: imei.substring(0, 3),
            estado: true,
            uid_mesa: imei,
          }
          if (data.length === 0) {
            this.postMesa(mesa).then(() => {
              console.log('Post Successful...');
              alert('Post Successful');
            }).catch(error => console.log('Error post:', error))
          }
        });
      }
    }).catch(error => {
      console.log('Error IMEI:', error);
      alert('Error email' + error);
    })
  }

  async onMesaNumber_uid() {

    this.uniqueDeviceID.get().then((uuid: any) => {
      console.log(uuid);
      if (uuid) {
        localStorage.setItem('uid_mesa', uuid);
        this.getMesas(uuid).subscribe(data => {
          const mesa = {
            id: '',
            nombre: 'mesa',
            numero: '',
            estado: true,
            uid_mesa: uuid,
          }
          if (data.length === 0) {
            this.postMesa(mesa).then(() => {
              console.log('Post Successful...');
            }).catch(error => console.log('Error post:', error))
          }
        });
      }

    }).catch((error: any) => console.log(error));

  }






}
