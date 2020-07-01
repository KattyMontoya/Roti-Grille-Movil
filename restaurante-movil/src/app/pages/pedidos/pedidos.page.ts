import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { PedidosI } from 'src/app/models/pedidos.interface';
import { LoadingController, ToastController, NavController, AlertController, ModalController } from '@ionic/angular';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ClienteI } from 'src/app/models/cliente.interface';
import { ClientePage } from '../cliente/cliente.page';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProductModalPage } from '../product-modal/product-modal.page';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

  dataPedido: PedidosI;
  dataCliente: ClienteI;
  loading: any;

  constructor(
    private db: AngularFirestore,
    private storageService: StorageService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private pedidosService: PedidosService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private clienteService: ClienteService
  ) { }

  ngOnInit() {
    this.getPedido();
    this.getCliente();
  }

  ionViewWillEnter() {
    this.getPedido();
    this.getCliente();
  }

  //===========================================================================
  // GET PEDIDO - STORAGE
  //===========================================================================

  async getPedido() {
    await this.storageService.getObject('pedido').then(res => {
      this.dataPedido = res;
      console.log('Pedido:', this.dataPedido);

      if (this.dataPedido) {
        if (this.dataPedido.productos.length === 0) {
          this.clearStorage();
          this.getPedido();
        }
      }

    }).catch(error => console.log('Error get data pedido:', error));
  }


  //===========================================================================
  // GET CLIENTE - STORAGE
  //===========================================================================

  async getCliente() {
    await this.storageService.getObject('cliente').then(res => {
      this.dataCliente = res;
      console.log('Cliente:', this.dataCliente);
    }).catch(error => console.log('Error get data cliente:', error));
  }

  //===========================================================================
  // CLEAR - STORAGE
  //===========================================================================

  async clearStorage() {
    await this.storageService.clearAll().then(res => {
      console.log('Clear All...');
    }).catch();

    localStorage.removeItem('factura');
  }

  //===========================================================================
  // LOADING - CONTROLLER - GLOBAL
  //===========================================================================

  async loadingController_global() {
    this.loading = await this.loadingCtrl.create({
      message: 'Procesando...',
      mode: 'ios'
    });
    await this.loading.present();
  }


  //===========================================================================
  // PLACE ORDER
  //===========================================================================

  async placeOrder() {
    await this.loadingController_global();


    const factura = localStorage.getItem('factura');

    if (factura) {
      if (factura === 'true') {
        this.dataPedido.factura = true;
      }
      if (factura === 'false') {
        this.dataPedido.factura = false;
      }
    } else {
      this.dataPedido.factura = false;
    }


    if (this.dataCliente.id !== '') { // SI existe cliente

      this.dataPedido.cliente = this.dataCliente.id;
      this.dataPedido.pedido = Math.floor(((Math.random() * 45) + 5) + ((Math.random() * 40) + 10));

      this.pedidosService.postPedido(this.dataPedido).then(() => {
        console.log('Place Order Successful...!!!');
        // this.postCliente();
        this.updateCliente();
        setTimeout(() => {
          this.clearStorage();
          this.toastAddProduct();
        }, 4000);

      }).catch(error => console.log('Error Place Order:', error))
    }


    if (this.dataCliente.id === '') {  // NO existe cliente

      const id_cliente = this.db.createId();
      this.dataPedido.cliente = id_cliente;
      this.dataCliente.id = id_cliente;
      this.dataPedido.pedido = Math.floor(((Math.random() * 45) + 5) + ((Math.random() * 40) + 10));

      this.pedidosService.postPedido(this.dataPedido).then(() => {
        console.log('Place Order Successful...!!!');
        this.postCliente();
        // setTimeout(() => {
        //   this.clearStorage();
        //   this.toastAddProduct();
        // }, 4000);

      }).catch(error => console.log('Error Place Order:', error))
    }


    setTimeout(() => {
      this.loading.dismiss();
    }, 4000);
  }


  //===========================================================================
  // POST - CLIENTE
  //===========================================================================

  async postCliente() {
    await this.clienteService.postCliente(this.dataCliente).then(() => {
      console.log('Cliente Successful...!!!');

      setTimeout(() => {
        this.clearStorage();
        this.toastAddProduct();
      }, 4000);

    }).catch(error => console.log('Error cliente:', error));
  }

  //===========================================================================
  // UPDATE - CLIENTE
  //===========================================================================

  async updateCliente() {
    await this.clienteService.updateCliente(this.dataCliente.id, this.dataCliente).then(() => {
      console.log('Cliente update Successful...!!!');
    }).catch(error => console.log('Error cliente:', error));
  }


  //===========================================================================
  // OPEN MODAL - CLIENTE
  //===========================================================================

  async openModalCliente() {
    const modal = await this.modalCtrl.create({
      mode: 'ios',
      animated: true,
      component: ClientePage,
      // backdropDismiss: estado,
      // componentProps: {
      //   dataProduct: ''
      // }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      if (data.estado) {
        this.getCliente();
        this.alertConfirm();
      }
    }


  }

  //===========================================================================
  // VALIDAR SI EXISTE CLIENTE REGISTRADO
  //===========================================================================

  validarDatos() {
    if (this.dataCliente) {
      this.alertConfirm();
    } else {
      this.alertConfirm_cliente();
    }
  }


  //===========================================================================
  // SUCCESSFUL MESSAGE
  //===========================================================================

  async toastAddProduct() {
    const toast = await this.toastCtrl.create({
      message: '¡Su pedido se realizó exitosamente!',
      position: 'bottom',
      mode: 'ios',
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      color: 'success',
      // duration: 3000
    });
    await toast.present();
    this.navCtrl.navigateForward('/juegos');
  }

  //===========================================================================
  // SUCCESSFUL MESSAGE
  //===========================================================================

  async toastRemove_order() {
    const toast = await this.toastCtrl.create({
      message: '¡Todo su pedido fué eliminado!',
      position: 'bottom',
      mode: 'ios',
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      color: 'danger',
      duration: 5000
    });
    await toast.present();
    this.navCtrl.navigateForward('/home');
  }

  //===========================================================================
  // ALERT CONFIRM - ORDER 
  //===========================================================================

  async alertConfirm() {
    const alert = await this.alertCtrl.create({
      header: '¡Atención!',
      message: '¿Está seguro de querer realizar su pedido?',
      mode: "ios",
      buttons: [{
        text: 'Sí',
        handler: () => {
          this.placeOrder();
        }
      }, {
        text: 'No',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel');
        }
      }]
    });
    await alert.present();
  }


  //===========================================================================
  // ALERT CONFIRM - REMOVE ORDER 
  //===========================================================================

  async alertConfirm_remove() {
    const alert = await this.alertCtrl.create({
      header: '¡Atención!',
      message: '¿Está seguro de querer cancelar toda su orden?',
      mode: "ios",
      buttons: [{
        text: 'Sí',
        handler: () => {
          this.loadingController_global();
          this.clearStorage();
          setTimeout(() => {
            this.loading.dismiss();
            this.toastRemove_order();
          }, 3000);
        }
      }, {
        text: 'No',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel');
        }
      }]
    });
    await alert.present();
  }


  //===========================================================================
  // ALERT CONFIRM - CLIENTE
  //===========================================================================

  async alertConfirm_cliente() {
    const alert = await this.alertCtrl.create({
      header: '¡Atención!',
      subHeader: 'Usted debe realizar su pedido a nombre de una persona.',
      // message: '¿Desea agregar un cliente?',
      mode: "ios",
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.openModalCliente();
        }
      }
        //   , {
        //   text: 'No',
        //   role: 'cancel',
        //   handler: () => {
        //     // console.log('Cancel');
        //   }
        // }
      ]
    });
    await alert.present();
  }


  //===========================================================================
  // OPEN MODAL - PRODUCT DETAIL
  //===========================================================================
  async openModalProduct(product: any, index: number) {
    console.log('Index:', index);

    localStorage.setItem('editar', 'true');
    localStorage.setItem('index', index.toString());

    const modal = await this.modalCtrl.create({
      mode: 'ios',
      animated: true,
      component: ProductModalPage,
      // backdropDismiss: estado,
      componentProps: {
        dataProduct: product
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    this.getPedido();
  }




}


// ====================================================================================
  // Prueba Storage
  // onSave() {
  //   // this.storageService.setValue('nombre', 'Geo').then(res => {
  //   //   console.log('Set:', res);
  //   // }).catch(error => console.log(error));

  //   this.storageService.setObject('data', this.dataCategories).then(res => {
  //     console.log('Set:', res);
  //   }).catch(error => console.log(error));

  // }

  // onGet() {
  //   // this.storageService.getValue('nombre').then(res => {
  //   //   console.log('Get:', res);
  //   // });

  //   this.storageService.getObject('data').then(res => {
  //     console.log('Get:', res);
  //   });
  // }

  // onRemove() {
  //   // this.storageService.removeValue('nombre').then(res => {
  //   //   console.log('remove:', res);
  //   // });

  //   this.storageService.removeValue('data').then(res => {
  //     console.log('remove:', res);
  //   });
  // }

  // onClearAll() {
  //   // this.storageService.removeValue('nombre').then(res => {
  //   //   console.log('remove:', res);
  //   // });

  //   this.storageService.clearAll().then(res => {
  //     console.log('Clear All:', res);
  //   });
  // }

  // ====================================================================================