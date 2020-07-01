import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { PedidosService } from './pedidos.service';
import { VibrationService } from './vibration.service';

@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {
  contador: string = '1';
  header: string = '';
  msg: string = '';

  constructor(
    private alertCtrl: AlertController,
    private pedidosService: PedidosService,
    private vibrationService: VibrationService
  ) { }

  async onPedidos_Alert() {
    localStorage.setItem('contador', '1');
    this.contador = localStorage.getItem('contador');

    this.pedidosService.getPedidos().subscribe(data => {
      // console.log('Pedos Alert:', data);
      const id_pedido = localStorage.getItem('id_pedido');
      console.log('Id_peido:');
      for (let pedido of data) {
        if (id_pedido) {
          if (id_pedido === pedido.id) {
            if (pedido.tipo === 'produccion') {
              if (this.contador === '1') {
                this.vibrationService.onVibration();
                localStorage.setItem('contador', '2');
                this.contador = localStorage.getItem('contador');
                const estado_pedido = 'Aceptado';
                const msg = pedido.mensaje ? pedido.mensaje : '';
                this.onAlertNotification(estado_pedido, msg);
              } else {
                localStorage.setItem('contador', '2');
                this.contador = localStorage.getItem('contador');
              }
            }

            if (pedido.tipo === 'finalizado') {
              if (this.contador === '2') {
                this.vibrationService.onVibration();
                localStorage.setItem('contador', '1');
                this.contador = localStorage.getItem('contador');
                const estado_pedido = 'Finalizado';
                const msg = pedido.mensaje ? pedido.mensaje : '';
                this.onAlertNotification(estado_pedido, msg);
                localStorage.removeItem('id_pedido');
              } else {
                localStorage.setItem('contador', '1');
                this.contador = localStorage.getItem('contador');
              }
            }

            console.log('1:', pedido.tipo);
            console.log('1:', pedido.estadoPedido);
            if (pedido.tipo === 'finalizado') {
              console.log('2:', pedido.tipo);
              console.log('2:', pedido.estadoPedido);

              if (pedido.estadoPedido === 'Rechazado') {
                console.log('3:', pedido.tipo);
                console.log('3:', pedido.estadoPedido);

                this.vibrationService.onVibration();
                localStorage.setItem('contador', '1');
                this.contador = localStorage.getItem('contador');
                const estado_pedido = 'Rechazado';
                const msg = pedido.mensaje ? pedido.mensaje : '';
                this.onAlertNotification(estado_pedido, msg);
                localStorage.removeItem('id_pedido');
              }
            }

          }
        } else {

          localStorage.removeItem('id_pedido');
          localStorage.removeItem('id_pedido');
          localStorage.setItem('contador', '1');
          this.contador = localStorage.getItem('contador');
        }
      }
    });
  }


  async onAlertNotification(estado_pedido: string, tiempo_espera: string) {
    // localStorage.setItem('contador', '2'); // Null

    if (estado_pedido === 'Aceptado') {
      this.header = 'Pedido: ' + estado_pedido + '.';
      this.msg = 'Tiempo de espera: ' + tiempo_espera + ' minutos.';
    }

    if (estado_pedido === 'Finalizado') {
      this.header = 'Pedido: ' + estado_pedido + '.';
      this.msg = 'Su pedido está listo.';
    }

    if (estado_pedido === 'Rechazado') {
      this.header = 'Pedido: ' + estado_pedido + '.';
      this.msg = 'Motivo: ' + tiempo_espera + '.';
    }

    const alert = await this.alertCtrl.create({
      header: '¡Atención!',
      subHeader: this.header,
      message: this.msg,
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
