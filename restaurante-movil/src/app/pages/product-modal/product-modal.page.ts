import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, LoadingController, ToastController, AlertController, IonRadioGroup, IonCheckbox } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ProductsI } from "../../models/products.interface";
import { PedidosI } from "../../models/pedidos.interface";
import { IngredientesService } from 'src/app/services/ingredientes.service';
import { RecetaI } from 'src/app/models/receta.interface';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.page.html',
  styleUrls: ['./product-modal.page.scss'],
})
export class ProductModalPage implements OnInit {
  @Input() dataProduct: ProductsI;

  @ViewChild('radioGroup', { static: false }) radioGroup: IonRadioGroup

  @ViewChild('checkBox1', { static: false }) checkBox1: IonCheckbox
  @ViewChild('checkBox2', { static: false }) checkBox2: IonCheckbox
  @ViewChild('checkBox3', { static: false }) checkBox3: IonCheckbox
  @ViewChild('checkBox4', { static: false }) checkBox4: IonCheckbox
  @ViewChild('checkBox5', { static: false }) checkBox5: IonCheckbox

  @ViewChild('checkBoxIngredientes', { static: false }) checkBoxIngredientes: IonCheckbox



  id_caregoria_bebidas: string = 'e9skaVDYzcyCtz1tr7GN';
  id_agua: string = 'YUjlfGFzxnj8WfiJxS8P';
  observacion: string = '';
  cantidad: number = 1;
  dataPedido: PedidosI;
  dataAddPedido: PedidosI = {
    id: '',
    cancelado: false,
    cliente: '',
    estado: true,
    fecha: Date.now(),
    productos: [],
    solicitud: '0', // 0 sin datos // 1 pedido pendiente
    tipo: 'pendiente', // pagado // pendiente
    total: 0,
    pedido: 0,
    factura: false,
    // temperatura: '',
    // sabor: {},
    subtotal: 0,
    iva: 0,
    token: '',
    uid_mesa: '',
  };

  editar: string = 'false';
  index: number;

  temperatura: string = '';
  sabor = {
    sabor1: '',
    sabor2: '',
    sabor3: '',
    sabor4: '',
    sabor5: '',
  };

  dataIngredites: RecetaI[];
  no_deseo: any = [];
  deseo_bebida: any = [];

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private storageService: StorageService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private ingredientesService: IngredientesService
  ) { }

  ngOnInit() {
    // console.log(this.dataProduct);
    this.getPedido();
    console.log(this.dataAddPedido.productos.length);
    console.log('Data Product:', this.dataProduct.ingredientes);

    if (this.dataProduct.id) {
      this.getDataIngredientes();
    }
    console.log('NODESSEOOOOO:', this.no_deseo);

  }

  ionViewWillEnter() {

    // setTimeout(() => {
    this.selectEditar();
    // }, 1000);

    // if (this.dataProduct.categoria === this.id_caregoria_bebidas) {
    //   this.radioGroup.value = 'frio';
    // }
  }

  //===========================================================================
  // CLOSE MODAL
  //===========================================================================

  closeModal() {
    this.modalCtrl.dismiss();
    localStorage.setItem('editar', 'false');
    localStorage.removeItem('index');
    localStorage.setItem('editar_check', 'no');
  }

  closeModalWithArguments() {
    this.modalCtrl.dismiss({
      estado: true
    });
    localStorage.setItem('editar', 'false');
    localStorage.removeItem('index');
    localStorage.setItem('editar_check', 'no');
  }

  //===========================================================================
  // GET INGREDIENTES
  //===========================================================================

  getDataIngredientes() {
    this.ingredientesService.getRecetas(this.dataProduct.id).subscribe(data => {
      this.dataIngredites = data;
      console.log('Ingredientes:', this.dataIngredites);
    });
  }

  //===========================================================================
  // REMOVE
  //===========================================================================

  onRemove() {
    if (this.cantidad > 1) {
      this.cantidad--;
      console.log(this.cantidad);
    }
  }


  //===========================================================================
  // ADD
  //===========================================================================

  onAdd() {
    if (this.cantidad > 0 && this.cantidad < 5) {
      this.cantidad++;
      console.log(this.cantidad);
    }
  }

  //===========================================================================
  // ADD PRODUCT
  //===========================================================================

  async addProduct() {
    const loading = await this.loadingCtrl.create({
      message: 'Agregando...',
      mode: 'ios'
    });
    await loading.present();
    // console.log('Agregando...');

    this.addPedido();

    setTimeout(() => {
      loading.dismiss();
    }, 2000);


  }

  //===========================================================================
  // ADD PEDIDO
  //===========================================================================

  async addPedido() {
    this.dataProduct.observacion = this.observacion;
    this.dataProduct.cantidad = this.cantidad;
    this.dataProduct.no_deseo = this.no_deseo;
    this.dataProduct.deseo_bebida = this.deseo_bebida;


    if (this.dataProduct.categoria === this.id_caregoria_bebidas) {
      this.dataProduct.temperatura = this.temperatura;
      // this.dataProduct.sabor = this.sabor;
    }


    if (!this.dataPedido) {
      if (this.dataAddPedido.solicitud === "0") {
        const token = localStorage.getItem('token');
        if (token) {
          this.dataAddPedido.token = token;
        }
        this.firstProduct();
      }
    } else {
      if (this.dataPedido.solicitud === "1") {
        this.secondProduct();
      }
    }
  }


  async  firstProduct() {
    this.dataAddPedido.fecha = Date.now();
    const uid_mesa = localStorage.getItem('uid_mesa');
    this.dataAddPedido.uid_mesa = uid_mesa ? uid_mesa : '';

    this.dataAddPedido.subtotal += (this.dataProduct.cantidad * this.dataProduct.precio);
    const iva = this.dataAddPedido.subtotal * 0.12;
    this.dataAddPedido.iva = parseFloat(iva.toFixed(2));
    this.dataAddPedido.subtotal = parseFloat(this.dataAddPedido.subtotal.toFixed(2));

    // this.dataAddPedido.total += (this.dataProduct.cantidad * this.dataProduct.precio);
    const total = this.dataAddPedido.subtotal + parseFloat(iva.toFixed(2));
    this.dataAddPedido.total = parseFloat(total.toFixed(2));
    this.dataAddPedido.solicitud = '1';

    this.dataAddPedido.productos.push(this.dataProduct);

    await this.storageService.setObject('pedido', this.dataAddPedido).then(() => {
      console.log('Pedido Add Successful...');

      setTimeout(() => {
        const msg = 'Producto agregado exitosamente..!!!';
        this.toastAddProduct(msg);
        this.closeModal();
      }, 2000);
    }).catch(error => console.log('Error Pedido Add...'));

  }



  async secondProduct() {
    this.dataPedido.subtotal += (this.dataProduct.cantidad * this.dataProduct.precio);
    const iva = this.dataPedido.subtotal * 0.12;
    this.dataPedido.iva = parseFloat(iva.toFixed(2));
    this.dataPedido.subtotal = parseFloat(this.dataPedido.subtotal.toFixed(2));

    // this.dataPedido.total += (this.dataProduct.cantidad * this.dataProduct.precio);
    const total = this.dataPedido.subtotal + parseFloat(iva.toFixed(2));
    this.dataPedido.total = parseFloat(total.toFixed(2));

    this.dataPedido.productos.push(this.dataProduct);

    await this.storageService.setObject('pedido', this.dataPedido).then(() => {
      console.log('Pedido Add Successful...');

      setTimeout(() => {
        const msg = 'Producto agregado exitosamente..!!!';
        this.toastAddProduct(msg);
        this.closeModal();
      }, 2000);
    }).catch(error => console.log('Error Pedido Add...'));
  }

  //===========================================================================
  // GET PEDIDO
  //===========================================================================

  async getPedido() {

    await this.storageService.getObject('pedido').then(res => {
      this.dataPedido = res;
      console.log('Pedido:', this.dataPedido);
    }).catch(error => console.log('Error get data:', error));
  }


  //===========================================================================
  // SUCCESSFUL MESSAGE
  //===========================================================================

  async toastAddProduct(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position: 'bottom',
      mode: 'ios',
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      color: 'dark',
      duration: 3000
    });
    await toast.present();
  }

  //===========================================================================
  // SELECT EDIT PRODUCT
  //===========================================================================

  selectEditar() {
    console.log('selectEditar', this.dataProduct);

    this.editar = localStorage.getItem('editar');
    this.index = parseInt(localStorage.getItem('index'));

    console.log('selectEditar → Index:', this.index);
    localStorage.setItem('editar_check', 'si');

    if (this.editar) {
      if (this.editar === 'true') {
        this.observacion = this.dataProduct.observacion;
        this.cantidad = this.dataProduct.cantidad;

        if (this.dataProduct.categoria === this.id_caregoria_bebidas) {
          if (this.dataProduct.deseo_bebida) {
            this.deseo_bebida = this.dataProduct.deseo_bebida;
          }
        } else {
          if (this.dataProduct.no_deseo) {
            this.no_deseo = this.dataProduct.no_deseo;
          }
        }



        if (this.dataProduct.categoria === this.id_caregoria_bebidas) {
          this.radioGroup.value = this.dataProduct.temperatura;

          if (this.dataProduct.sabor) {

            if (this.dataProduct.sabor.sabor1 === 'naranja') {
              this.checkBox1.checked = true;
            }
            if (this.dataProduct.sabor.sabor2 === 'fresa') {
              this.checkBox2.checked = true;
            }
            if (this.dataProduct.sabor.sabor3 === 'limon') {
              this.checkBox3.checked = true;
            }
            if (this.dataProduct.sabor.sabor4 === 'manzana') {
              this.checkBox4.checked = true;
            }
            if (this.dataProduct.sabor.sabor5 === 'coca-cola') {
              this.checkBox5.checked = true;
            }
          }
        }

        // Ingredientes - no desea
        // if (this.dataProduct.no_deseo) {

        //   for (let ingrediente of this.dataIngredites) {
        //     console.log('Editar Ingredientes:', ingrediente);
        //     for (let no_deseo of this.dataProduct.no_deseo) {
        //       if (ingrediente.id === no_deseo.id) {
        //         console.log('Editar Ingredientes No Desea:', no_deseo);
        //         // this.checkBoxIngredientes.checked = true;
        //         this.checkBoxIngredientes.value = ingrediente.id;
        //         this.checkBoxIngredientes.checked = true;
        //       }
        //     }
        //   }
        // }

        console.log('selectEditar → upload data');
      }
    }
  }

  //===========================================================================
  // EDIT PRODUCT
  //===========================================================================

  async editProduct() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      mode: 'ios'
    });
    await loading.present();

    console.log('Editar Product');

    this.dataProduct.observacion = this.observacion;
    this.dataProduct.cantidad = this.cantidad;

    if (this.dataProduct.categoria === this.id_caregoria_bebidas) {
      this.dataProduct.temperatura = this.temperatura;
      // this.dataProduct.sabor = this.sabor;
    }
    this.dataProduct.no_deseo = this.no_deseo;
    this.dataProduct.deseo_bebida = this.deseo_bebida;

    this.dataPedido.subtotal -= (this.dataPedido.productos[this.index].cantidad * this.dataPedido.productos[this.index].precio);
    // this.dataPedido.total -= (this.dataPedido.productos[this.index].cantidad * this.dataPedido.productos[this.index].precio);
    this.dataPedido.subtotal += (this.dataProduct.cantidad * this.dataProduct.precio);

    const iva = this.dataPedido.subtotal * 0.12;
    this.dataPedido.iva = parseFloat(iva.toFixed(2));
    this.dataPedido.subtotal = parseFloat(this.dataPedido.subtotal.toFixed(2));
    const total = this.dataPedido.subtotal + parseFloat(iva.toFixed(2));
    this.dataPedido.total = parseFloat(total.toFixed(2));

    // this.dataPedido.total += (this.dataProduct.cantidad * this.dataProduct.precio);
    this.dataPedido.productos[this.index] = this.dataProduct;

    await this.storageService.setObject('pedido', this.dataPedido).then(() => {
      console.log('Pedido Add Successful...');

      setTimeout(() => {
        const msg = 'Producto modificado exitosamente..!!!';
        this.toastAddProduct(msg);
        this.closeModal();
      }, 2000);
    }).catch(error => console.log('Error Pedido Add...'));


    setTimeout(() => {
      loading.dismiss();
    }, 2000);

  }


  //===========================================================================
  // DELETE PRODUCT
  //===========================================================================

  async deleteProduct() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      mode: 'ios'
    });
    await loading.present();

    console.log('Delete Product');
    this.dataPedido.subtotal -= (this.dataPedido.productos[this.index].cantidad * this.dataPedido.productos[this.index].precio);
    // this.dataPedido.total -= (this.dataPedido.productos[this.index].cantidad * this.dataPedido.productos[this.index].precio);

    const iva = this.dataPedido.subtotal * 0.12;
    this.dataPedido.iva = parseFloat(iva.toFixed(2));
    this.dataPedido.subtotal = parseFloat(this.dataPedido.subtotal.toFixed(2));
    this.dataPedido.total = this.dataPedido.subtotal + parseFloat(iva.toFixed(2));

    this.dataPedido.productos.splice(this.index, 1);

    console.log('Productos delete:', this.dataPedido.productos);

    await this.storageService.setObject('pedido', this.dataPedido).then(() => {
      console.log('Pedido Add Successful...');

      setTimeout(() => {
        const msg = 'Producto eliminado exitosamente..!!!';
        this.toastAddProduct(msg);
        this.closeModal();
      }, 2000);
    }).catch(error => console.log('Error Pedido Add...'));


    setTimeout(() => {
      loading.dismiss();
    }, 2000);

  }




  //===========================================================================
  // ALERT CONFIRM - REMOVE PRODUCT
  //===========================================================================

  async alertConfirm_remove() {
    const alert = await this.alertCtrl.create({
      header: '¡Atención!',
      message: '¿Está seguro de querer eliminar este producto?',
      mode: "ios",
      buttons: [{
        text: 'Sí',
        handler: () => {
          this.deleteProduct();
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
  // RADIO - BEBIDA - ESTADO (Fría o al clima)
  //===========================================================================

  async selectedRadioEstado(event) {
    // this.radioGroup.value = 'efectivo'
    // console.log('Estado:', event);
    console.log('Estado:', event.detail.value);
    this.temperatura = event.detail.value;

  }


  //===========================================================================
  // CHECK - BEBIDA - SABORES
  //===========================================================================

  onCheckSabores(event, sabor: string) { // No utilizado
    // this.check = event.detail.checked;
    console.log('Sabor:', event.detail.checked, sabor);
    // console.log('Factura:', this.factura_check.toString());

    if (event.detail.checked && sabor === 'naranja') {
      this.sabor.sabor1 = 'naranja';
    } else if (event.detail.checked && sabor === 'fresa') {
      this.sabor.sabor2 = 'fresa';
    } else if (event.detail.checked && sabor === 'limon') {
      this.sabor.sabor3 = 'limon';
    } else if (event.detail.checked && sabor === 'manzana') {
      this.sabor.sabor4 = 'manzana';
    } else if (event.detail.checked && sabor === 'coca-cola') {
      this.sabor.sabor5 = 'coca-cola';
    }


    if (!event.detail.checked && sabor === 'naranja') {
      this.sabor.sabor1 = '';
    } else if (!event.detail.checked && sabor === 'fresa') {
      this.sabor.sabor2 = '';
    } else if (!event.detail.checked && sabor === 'limon') {
      this.sabor.sabor3 = '';
    } else if (!event.detail.checked && sabor === 'manzana') {
      this.sabor.sabor4 = '';
    } else if (!event.detail.checked && sabor === 'coca-cola') {
      this.sabor.sabor5 = '';
    }


  }


  //===========================================================================
  // CHECK - INGREDIENTES QUE NO DESEO - ALIMENTOS
  //===========================================================================

  onCheckIngrediente(event, ingrediente, index) {
    // this.check = event.detail.checked;
    const editar_check = localStorage.getItem('editar_check');
    if (editar_check == 'si') {
      this.no_deseo = [];
      localStorage.setItem('editar_check', 'no');
    }

    console.log('Checked:', event.detail.checked);
    console.log('Index:', index);
    console.log('id_receta:', event.detail.value);
    console.log('Ingrediente:', ingrediente);

    if (event.detail.checked) {
      const noDeseo = {
        id: ingrediente.id,
        iPlato: ingrediente.iPlato,
        ingrediente: ingrediente.ingrediente,
        index: index,
      };
      this.no_deseo.push(noDeseo);
    }

    if (!event.detail.checked) {
      // const noDeseo = {
      //   id: ingrediente.id,
      //   iPlato: ingrediente.iPlato,
      //   ingrediente: ingrediente.ingrediente,
      //   index: index,
      // };

      if (this.no_deseo && this.no_deseo.length !== 0) {
        for (let i = 0; i < this.no_deseo.length; i++) {
          const element = this.no_deseo[i];
          if (element.id === event.detail.value) {
            this.no_deseo.splice(i, 1);
          }
        }
      }
    }
    console.log('NO DESEOOOOOOO:', this.no_deseo);
    // console.log('Factura:', this.factura_check.toString());
  }


  //===========================================================================
  // CHECK - INGREDIENTES QUE SI DESEO - BEBIDA 
  //===========================================================================

  onCheckIngrediente_Bebidas(event, ingrediente, index) {
    // this.check = event.detail.checked;
    const editar_check = localStorage.getItem('editar_check');
    if (editar_check == 'si') {
      this.deseo_bebida = [];
      localStorage.setItem('editar_check', 'no');
    }

    console.log('Checked:', event.detail.checked);
    console.log('Index:', index);
    console.log('id_receta:', event.detail.value);
    console.log('Ingrediente:', ingrediente);

    if (event.detail.checked) {
      const deseoBebida = {
        id: ingrediente.id,
        iPlato: ingrediente.iPlato,
        ingrediente: ingrediente.ingrediente,
        index: index,
      };
      this.deseo_bebida.push(deseoBebida);
    }

    if (!event.detail.checked) {
      // const deseoBebida = {
      //   id: ingrediente.id,
      //   iPlato: ingrediente.iPlato,
      //   ingrediente: ingrediente.ingrediente,
      //   index: index,
      // };

      if (this.deseo_bebida && this.deseo_bebida.length !== 0) {
        for (let i = 0; i < this.deseo_bebida.length; i++) {
          const element = this.deseo_bebida[i];
          if (element.id === event.detail.value) {
            this.deseo_bebida.splice(i, 1);
          }
        }
      }
    }

    console.log('DESEO BEBIDAAAA:', this.deseo_bebida);
    // console.log('Factura:', this.factura_check.toString());
  }







}
