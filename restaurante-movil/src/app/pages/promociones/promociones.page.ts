import { Component, OnInit } from '@angular/core';
import { PromocionesService } from 'src/app/services/promociones.service';
import { PromocionesI } from 'src/app/models/promociones.interface';
import { ProductModalPage } from '../product-modal/product-modal.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-promociones',
  templateUrl: './promociones.page.html',
  styleUrls: ['./promociones.page.scss'],
})
export class PromocionesPage implements OnInit {

  dataPromociones: PromocionesI[];
  fechaI: any;
  fechaF: any;

  constructor(
    private promocionesService: PromocionesService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getDataPromociones();
    // this.filterDate();
    console.log('Date:', Date.now());
  }

  //===========================================================================
  // GET DATA PROMOCIONES - NO UTILIZADO
  //===========================================================================

  getDataPromociones() {
    this.promocionesService.getPromociones().subscribe(data => {
      this.dataPromociones = data;
      console.log('Promociones:', this.dataPromociones);
    });
  }

  //===========================================================================
  // GET DATA PROMOCIONES 
  //===========================================================================

  getDataPromociones_filterDate() {
    this.promocionesService.getPromociones_FilterDate(this.fechaI, this.fechaF).subscribe(data => {
      this.dataPromociones = data;
      console.log('Promociones:', this.dataPromociones);
    });
  }

  //===========================================================================
  // OPEN MODAL - PROMOCION (PRODUCT) DETAIL
  //===========================================================================

  async openModalProduct(promocion: any) {
    const modal = await this.modalCtrl.create({
      mode: 'ios',
      animated: true,
      component: ProductModalPage,
      // backdropDismiss: estado,
      componentProps: {
        dataProduct: promocion
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
  }



  //===========================================================================
  // DATA TIME

  async filterDate() {
    const date = new Date;
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let dateStart = year + '-' + month + '-' + day + ' 00:00';
    let newDateStart = +new Date(dateStart);
    this.fechaI = (Math.floor(newDateStart));

    let dateEnd = year + '-' + month + '-' + day + ' 23:59';
    let newDateEnd = +new Date(dateEnd);
    this.fechaF = (Math.floor(newDateEnd));

    this.getDataPromociones_filterDate();
  }















}
