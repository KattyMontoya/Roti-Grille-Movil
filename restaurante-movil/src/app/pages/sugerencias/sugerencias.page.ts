import { Component, OnInit, ViewChild } from '@angular/core';
import { SugerenciasService } from 'src/app/services/sugerencias.service';
import { ToastController, IonSelect, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.page.html',
  styleUrls: ['./sugerencias.page.scss'],
})
export class SugerenciasPage implements OnInit {

  @ViewChild('onSelected', { static: false }) onSelected: IonSelect

  tipo: string = '';
  detalle: string = '';

  constructor(
    private sugerenciasService: SugerenciasService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }


  //===========================================================================
  // SELECT SERVICES
  //===========================================================================

  onSelect(event) {
    console.log('Tipo:', event.detail.value);
    if (event.detail.value === '') {
      this.tipo = '';
    } else {
      this.tipo = event.detail.value;
    }

    console.log('Tipo 2:', this.tipo);
  }

  //===========================================================================
  // SEND DATA
  //===========================================================================

  async sendData() {
    const loading = await this.loadingCtrl.create({
      message: 'Procesando...',
      mode: 'ios'
    });
    await loading.present();

    const uid_mesa = localStorage.getItem('uid_mesa');
    const data = {
      id: '',
      tipo: this.tipo,
      detalle: this.detalle,
      estado: true,
      time: Date.now(),
      uid_mesa: uid_mesa ? uid_mesa : ''
    }

    await this.sugerenciasService.postSugerencia(data).then(async () => {
      console.log('Post Sugerencia...');
      this.onAlertNotification(this.tipo);
      // await this.toastSend();
      this.onSelected.value = '';
      this.tipo = '';
      this.detalle = '';
    }).catch(error => console.log('Error Post Sugerencia:', error))

    await loading.dismiss();
  }

  //===========================================================================
  // SUCCESSFUL MESSAGE
  //===========================================================================

  async toastSend() {
    const toast = await this.toastCtrl.create({
      message: this.tipo + ' enviada exitosamente...',
      position: 'bottom',
      mode: 'ios',
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      color: 'success',
      duration: 3000
    });
    await toast.present();
  }

  //===========================================================================
  // SUCCESSFUL MESSAGE - NOTIFICATION
  //===========================================================================

  async onAlertNotification(texto: string) {
    // localStorage.setItem('contador', '2'); // Null
    const alert = await this.alertCtrl.create({
      header: 'Estimado cliente:',
      // subHeader: tiempo_espera,
      message: 'Su <b>' + texto + '</b> ha sido registrada, analizaremos el tema para seguir mejorando.',
      mode: "ios",
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          // alert notification
          console.log('Alert....');
        }
      }]
    });
    await alert.present();
  }



}
