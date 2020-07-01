import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private fcm: FCM
  ) { }


  getToken() {
    this.fcm.getToken().then(token => {
      // backend.registerToken(token);
      localStorage.setItem('token', token);
    }).catch(error => console.log('Error get Token:', error));
  }

  updateToke() {
    this.fcm.onTokenRefresh().subscribe(token => {
      // backend.registerToken(token);
      localStorage.setItem('token', token);
    });

  }

  onNotifications() {
    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
      };
    });


  }




}
