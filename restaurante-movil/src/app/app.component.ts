import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FcmService } from './services/fcm.service';
import { AlertServiceService } from './services/alert-service.service';
import { MesaService } from './services/mesa.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcmService: FcmService,
    private alertServiceService: AlertServiceService,
    private mesaService: MesaService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fcmService.getToken();
      this.fcmService.updateToke();
      this.alertServiceService.onPedidos_Alert();
      // this.mesaService.onMesaNumber();
      this.mesaService.onMesaNumber_uid();
    });
  }
}
