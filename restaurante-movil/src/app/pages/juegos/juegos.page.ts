import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, IonSelect } from '@ionic/angular';

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.page.html',
  styleUrls: ['./juegos.page.scss'],
})
export class JuegosPage implements OnInit {

  // dataJuegos: any;
  @ViewChild('onSelect_value', { static: false }) onSelect_value: IonSelect

  num: number;
  mayorMenor = '...?';
  numSecret: number = this.numAleatorio(0, 100);

  text_msm: boolean = false;
  select_game: string = '';
  loading: any;

  img_left = [
    {
      item: '1',
      path: 'assets/fruits/apple1.svg'
    }, {
      item: '2',
      path: 'assets/fruits/apple2.svg'
    }, {
      item: '3',
      path: 'assets/fruits/apple3.svg'
    }, {
      item: '4',
      path: 'assets/fruits/cherries1.svg'
    }, {
      item: '5',
      path: 'assets/fruits/pear1.svg'
    }, {
      item: '6',
      path: 'assets/fruits/pear2.svg'
    }, {
      item: '7',
      path: 'assets/fruits/pear3.svg'
    }, {
      item: '8',
      path: 'assets/fruits/strawberry1.svg'
    }, {
      item: '9',
      path: 'assets/fruits/strawberry2.svg'
    }, {
      item: '10',
      path: 'assets/fruits/strawberry3.svg'
    },
  ];

  img_center = [
    {
      item: '1',
      path: 'assets/fruits/apple1.svg'
    }, {
      item: '2',
      path: 'assets/fruits/apple2.svg'
    }, {
      item: '3',
      path: 'assets/fruits/apple3.svg'
    }, {
      item: '4',
      path: 'assets/fruits/cherries1.svg'
    }, {
      item: '5',
      path: 'assets/fruits/pear1.svg'
    }, {
      item: '6',
      path: 'assets/fruits/pear2.svg'
    }, {
      item: '7',
      path: 'assets/fruits/pear3.svg'
    }, {
      item: '8',
      path: 'assets/fruits/strawberry1.svg'
    }, {
      item: '9',
      path: 'assets/fruits/strawberry2.svg'
    }, {
      item: '10',
      path: 'assets/fruits/strawberry3.svg'
    },
  ];

  img_right = [
    {
      item: '1',
      path: 'assets/fruits/apple1.svg'
    }, {
      item: '2',
      path: 'assets/fruits/apple2.svg'
    }, {
      item: '3',
      path: 'assets/fruits/apple3.svg'
    }, {
      item: '4',
      path: 'assets/fruits/cherries1.svg'
    }, {
      item: '5',
      path: 'assets/fruits/pear1.svg'
    }, {
      item: '6',
      path: 'assets/fruits/pear2.svg'
    }, {
      item: '7',
      path: 'assets/fruits/pear3.svg'
    }, {
      item: '8',
      path: 'assets/fruits/strawberry1.svg'
    }, {
      item: '9',
      path: 'assets/fruits/strawberry2.svg'
    }, {
      item: '10',
      path: 'assets/fruits/strawberry3.svg'
    },
  ];

  index_left: number = 0;
  index_center: number = 5;
  index_right: number = 9;

  index_1: number;
  index_2: number;
  index_3: number;

  start_game: boolean = false;
  off_game: boolean = false;
  // change_button: boolean = false;
  button_text: string = 'Iniciar';

  // public path_img = 'assets/fruits/apple1.svg';

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    console.log('Num:', this.numSecret);
  }

  // aleatorio() {
  //   console.log('Eleatorio:', Math.floor(Math.random() * 5));
  // }

  //===========================================================================

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Verificando...',
      mode: 'ios'
    });
    await this.loading.present();

  }

  //===========================================================================

  numAleatorio(a, b) {
    return Math.round(Math.random() * (b - a) + parseInt(a, 10));
  }

  //===========================================================================

  async compruebaNumero() {
    if (this.num) {
      await this.presentLoading();
      if (this.numSecret < this.num) {
        this.mayorMenor = ' menor que';
      }
      else if (this.numSecret > this.num) {
        this.mayorMenor = ' mayor que';
      }
      else {
        this.mayorMenor = '';
        console.log('Numero encontrado', this.num);
        this.alertConfirm();

      }
      await this.loading.dismiss();
    }
  }

  //===========================================================================

  messageText(event) {
    // console.log(event.detail.value);
    if (event.detail.value !== '') {
      this.text_msm = true;
    } else {
      this.text_msm = false;
    }
  }

  //===========================================================================
  // RESET GAME
  //===========================================================================

  resetGame() {
    this.num = null;
    this.mayorMenor = '...?';
    this.numSecret = this.numAleatorio(0, 100);
    this.text_msm = false;
    console.log('Nuevo num secret:', this.numSecret);

    // Tragamonedas
    this.start_game = false;
    this.index_left = 0;
    this.index_center = 5;
    this.index_right = 9;

    this.select_game = '';
    this.off_game = false;
    this.button_text = 'Iniciar';
    setTimeout(() => {
      this.onSelect_value.value = "";
    }, 500);
  }

  //===========================================================================

  onSelect(event) {
    console.log(event.detail.value);
    this.select_game = event.detail.value;

    if (event.detail.value) {
      console.log('EXISTE');
      this.off_game = true;
    }

    if (!event.detail.value) {
      console.log('NO EXISTE');
      this.off_game = false;
    }
  }


  onSelectButton(select_game: string) {
    console.log('Select Button:', select_game);
    this.select_game = select_game;
    this.off_game = true;
  }

  //===========================================================================
  //  TRAGA MONEDAS
  //===========================================================================

  async onTragaMonedas() {
    // this.start_game = false;
    // console.log('Traga Monedas');
    // this.index_left = Math.floor(Math.random() * 10);
    // this.index_center = Math.floor(Math.random() * 10);
    // this.index_right = Math.floor(Math.random() * 10);
    this.button_text = 'Girar';

    this.index_1 = Math.floor(Math.random() * 10);
    this.index_2 = Math.floor(Math.random() * 10);
    this.index_3 = Math.floor(Math.random() * 10);

    await this.presentLoading();
    this.start_game = true;

    setTimeout(() => {
      this.imgLeft();

      setTimeout(() => {
        this.imgCenter();
      }, 500);

      setTimeout(() => {
        this.imgRight();
      }, 1000);

    }, 500);

    // Ganador
    setTimeout(() => {
      if (this.index_1 === this.index_2 && this.index_1 === this.index_3 && this.index_2 === this.index_3) {
        this.alertTragaMonedas();
      }
    }, 1500);

    console.log('Fin de Funcion');
    await this.loading.dismiss();
  }


  imgLeft() {
    for (let i in this.img_left) {
      console.log(parseInt(i));
      const num1 = parseInt(i);
      if (this.index_1 === num1) {
        this.index_left = num1;
        console.log('Select:', this.index_left);
        return;
      }
    }
  }

  imgCenter() {
    for (let i in this.img_center) {
      console.log(parseInt(i));
      const num2 = parseInt(i);
      if (this.index_2 === num2) {
        this.index_center = num2;
        console.log('Select:', this.index_center);
        return;
      }
    }
  }

  imgRight() {
    for (let i in this.img_right) {
      console.log(parseInt(i));
      const num3 = parseInt(i);
      if (this.index_3 === num3) {
        this.index_right = num3;
        console.log('Select:', this.index_right);
        return;
      }
    }
  }


  //===========================================================================
  //Alert

  async alertConfirm() {
    const alert = await this.alertCtrl.create({
      header: '¡Felicidades!',
      message: '¡Adivinaste! El número secreto es: ' + this.numSecret,
      mode: 'ios',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.resetGame();
        }
      }]
    });
    await alert.present();
  }

  //===========================================================================
  //Alert

  async alertTragaMonedas() {
    const alert = await this.alertCtrl.create({
      header: '¡Felicidades!',
      message: '¡Ganaste! Eres el mejor.',
      mode: 'ios',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.resetGame();
        }
      }]
    });
    await alert.present();
  }



}
