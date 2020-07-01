import { Component, OnInit } from '@angular/core';
import { slides, slideOptsOne } from "../../providers/variables";
import { NavController } from '@ionic/angular';
import { AdsService } from 'src/app/services/ads.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  // slides = slides;
  dataSlides: any;

  slideOpts = slideOptsOne;

  constructor(
    private navCtrl: NavController,
    private adsService: AdsService
  ) { }

  ngOnInit() {
    this.getDataAds_home();
  }

  nextPage() {
    this.navCtrl.navigateForward('categories');
  }

  // ====================================================================================
  // GET DATA ADS
  // ====================================================================================

  // getDataAds_home() {
  //   this.adsService.getAds_home().subscribe(data => {
  //     if (data.length > 0) {
  //       this.dataSlides = data;
  //       console.log(this.dataSlides);
  //     }
  //   });
  // }


  getDataAds_home() {
    this.adsService.getAds_home_restaurante().subscribe(data => {
      if (data.length > 0) {
        this.dataSlides = data;
        console.log('Slides:',this.dataSlides);
      }
    });
  }


}
