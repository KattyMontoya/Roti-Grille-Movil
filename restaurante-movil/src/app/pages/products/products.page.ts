import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { ProductsI } from 'src/app/models/products.interface';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ModalController } from '@ionic/angular';
import { ProductModalPage } from '../product-modal/product-modal.page';
import { PedidosI } from 'src/app/models/pedidos.interface';
import { StorageService } from 'src/app/services/storage.service';
import { computeStackId } from '@ionic/angular/dist/directives/navigation/stack-utils';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  dataProducts: ProductsI[];
  dataPedido: PedidosI;

  id_categoria: string;
  imagen_categoria: string;
  nombre_categoria: string;
  textoBuscar: string = '';

  constructor(
    private productsService: ProductsService,
    private router: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.id_categoria = this.router.snapshot.params['id_categoria'];
    this.imagen_categoria = this.router.snapshot.params['imagen_categoria'];
    this.nombre_categoria = this.router.snapshot.params['nombre_categoria'];
    this.getPedido();

    // console.log(this.id_categoria);
    if (this.id_categoria, this.imagen_categoria, this.nombre_categoria) {
      this.getDataProducts();
    }

  }

  onBack() {
    this.navCtrl.navigateForward('/categories');
  }


  //===========================================================================
  // GET DATA PRODUCTS
  //===========================================================================

  async getDataProducts() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      mode: 'ios'
    });
    await loading.present();
    this.productsService.getProducts(this.id_categoria).subscribe(data => {
      if (data.length > 0) {
        this.dataProducts = data;
        this.dataProducts.sort((a, b) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()));
        // console.log(data);
        loading.dismiss();
      } else {
        loading.dismiss();
      }
    });

    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }

  //===========================================================================
  // OPEN MODAL - PRODUCT DETAIL
  //===========================================================================
  async openModalProduct(product: any) {
    localStorage.setItem('editar', 'false');
    localStorage.removeItem('index');

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

  // ====================================================================================
  // BUSCADOR
  // ====================================================================================

  buscar(event: any) {
    this.textoBuscar = event.detail.value;
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

  onPedido() {
    this.navCtrl.navigateForward('pedidos');
  }



}
