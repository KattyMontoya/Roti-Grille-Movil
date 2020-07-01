import { Component, OnInit } from '@angular/core';
import { slideOptsOne } from "../../providers/variables";
import { CategoriesService } from 'src/app/services/categories.service';
import { AdsService } from 'src/app/services/ads.service';
import { CategoriesI } from 'src/app/models/categories.interface';
import { StorageService } from 'src/app/services/storage.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  slideOpts = slideOptsOne;
  dataSlides: any;
  dataCategories: any;
  textoBuscar: string = '';

  constructor(
    private categoriesService: CategoriesService,
    private adsService: AdsService,
    private loadingCtrl: LoadingController,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.getDatacategories();
    this.getDataAds_categorias();
    // console.log('Random:', Math.floor((Math.random() * 100) + 1));
    

  }

  // ====================================================================================
  // GET DATA CATEGORIES
  // ====================================================================================

  async getDatacategories() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      mode: 'ios'
    });
    await loading.present();
    this.categoriesService.getCategories().subscribe(data => {
      if (data.length > 0) {
        this.dataCategories = data;
        // this.dataCategories.sort((a, b) => a.nombre - b.nombre);
        this.dataCategories.sort((a, b) => a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()));
        console.log('Categories:', data);
        loading.dismiss();
      } else {
        loading.dismiss();
      }
    });
    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }

  // ====================================================================================
  // GET DATA ADS
  // ====================================================================================

  getDataAds_categorias() {
    this.adsService.getAds_categorias().subscribe(data => {
      if (data.length > 0) {
        this.dataSlides = data;
        console.log('Ad:', data);
      }
    });
  }

  // ====================================================================================
  // BUSCADOR
  // ====================================================================================

  buscar(event: any) {
    this.textoBuscar = event.detail.value;
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


}
