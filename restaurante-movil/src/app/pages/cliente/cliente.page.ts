import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LoadingController, ToastController, ModalController, IonSearchbar } from '@ionic/angular';
import { ClienteService } from 'src/app/services/cliente.service';
import { ClienteI } from 'src/app/models/cliente.interface';
import { StorageService } from 'src/app/services/storage.service';
// import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {
  @ViewChild('searchBar', { static: false }) searchBar: IonSearchbar
  myForm: FormGroup;

  createFormGroup() {
    return new FormGroup({
      // nombre: new FormControl({value: '', disabled: true}, Validators.required),
      id: new FormControl(''),
      nombre: new FormControl('', [Validators.required, Validators.pattern('[a-zA-ZñÑ ]{1,254}')]),
      apellido: new FormControl('', [Validators.required, Validators.pattern('[a-zA-ZñÑ ]{1,254}')]),
      cedula: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      contacto: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      direccion: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      estado: new FormControl(true),
      perfil: new FormControl(''),
      time_registro: new FormControl(Date.now()),
    });
  }


  searchInput: string = '';
  searchButton: boolean = false;
  form_hidden: boolean = false;
  button_hidden: boolean = false;
  factura_check: boolean = false;

  dataCliente: ClienteI;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private clienteService: ClienteService,
    private storageService: StorageService,
    private modalCtrl: ModalController,
    // private db: AngularFirestore
  ) {
    this.myForm = this.createFormGroup();
    // this.myForm.disable();
    // this.myForm.enable();
  }

  ngOnInit() {
    // this.myForm = this.createFormGroup();
    localStorage.setItem('factura', 'false');
  }


  //===========================================================================
  // CLOSE MODAL
  //===========================================================================

  closeModal() {
    this.modalCtrl.dismiss();
  }

  closeModalWithArguments() {
    this.modalCtrl.dismiss({
      estado: true
    });
  }


  //================================================================================
  // RESET FORM
  //================================================================================

  resetForm() {
    this.myForm.reset();
  }

  //================================================================================
  //SAVE INFORMATION FORM
  //================================================================================

  async saveForm() {
    // this.myForm.get('id').setValue(this.db.createId());
    this.myForm.get('time_registro').setValue(Date.now());

    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      // duration: 5000,
      message: 'Guardando...',
      translucent: true,
    });
    await loading.present();

    if (this.dataCliente) {

      this.dataCliente.nombre = this.myForm.value.nombre;
      this.dataCliente.apellido = this.myForm.value.apellido;
      this.dataCliente.cedula = this.myForm.value.cedula;
      this.dataCliente.contacto = this.myForm.value.contacto;
      this.dataCliente.direccion = this.myForm.value.direccion;
      this.dataCliente.email = this.myForm.value.email;

      await this.storageService.setObject('cliente', this.dataCliente).then(() => {
        console.log('Cliente agregado...!!');
        this.mensajeExito();
        this.closeModalWithArguments();
      }).catch(error => {
        console.log('Error agregado Cliente:', error);
        this.mensajeError();
      });

    } else {

      await this.storageService.setObject('cliente', this.myForm.value).then(() => {
        console.log('Cliente agregado...!!');
        this.mensajeExito();
        this.closeModalWithArguments();
      }).catch(error => {
        console.log('Error agregado Cliente:', error);
        this.mensajeError();
      });

    }
    await loading.dismiss();
  }



  //================================================================================
  // Buscar actividades por codigo insertado en el searchbar
  //================================================================================

  async buscarCliente_Online(event_cedula) {

    if (event_cedula) {
      let ci = event_cedula.slice(0, 10);
      event_cedula = ci;
    }
    if (event_cedula != '' && !this.searchButton) {
      this.dataCliente = null;
      const loading = await this.loadingCtrl.create({
        message: 'Loading...'
      });
      loading.present();

      this.clienteService.getClientes(event_cedula).subscribe(data => {
        console.log('Clietes:', data.length);
        if (data.length !== 0) {
          for (let cliente of data) {
            this.dataCliente = cliente;
            // console.log('Data Cliente:', this.dataCliente);
            this.shownDataCliente();
            this.searchButton = true;
            this.form_hidden = true;
            this.button_hidden = true;
            return;
          }
        } else {
          this.searchButton = true;
          this.form_hidden = true;
          this.button_hidden = false;
          this.myForm.get('cedula').setValue(this.searchInput);
        }

      });

      await loading.dismiss();

    } else {
      // this.dataActividadesFinal();
      // this.resetForm();
    }
  }


  //================================================================================
  // Si el searchbar queda vacío vuelve a consultar 
  //================================================================================

  async vacioSearch() {

    if (this.searchInput) {
      let search = this.searchInput.slice(0, 10);
      this.searchInput = '';
      this.searchInput = search;
      this.searchBar.value = search;
    }

    if (this.searchInput === '' && !this.searchButton) {
      // this.dataActividadesFinal();
      // this.resetForm();
      // this.myForm = this.createFormGroup();
      this.clearData();
      console.log('Vacio:', this.myForm.value);
    }
  }


  //================================================================================
  // CLEAR DATA CLIENTE
  //================================================================================

  clearData() {
    // this.myForm.enable();  // *** Geo ***
    this.resetForm();

    this.myForm = this.createFormGroup();
    this.searchButton = false;
    this.form_hidden = false;
    this.button_hidden = false;
    this.searchInput = '';
  }

  //================================================================================
  // SHOWN DATA CLIENTE
  //================================================================================

  shownDataCliente() {

    // this.myForm.value.nombre = this.dataCliente.nombre
    // this.myForm.get('nombre').setValue(this.dataCliente.nombre, { disabled: false });

    this.myForm.get('nombre').setValue(this.dataCliente.nombre);
    this.myForm.get('apellido').setValue(this.dataCliente.apellido);
    this.myForm.get('cedula').setValue(this.dataCliente.cedula);
    this.myForm.get('contacto').setValue(this.dataCliente.contacto);
    this.myForm.get('direccion').setValue(this.dataCliente.direccion);
    this.myForm.get('email').setValue(this.dataCliente.email);
    // this.myForm.get('estado').setValue(this.dataCliente.estado);
    // this.myForm.get('perfil').setValue(this.dataCliente.nombre);
    // this.myForm.get('time_registro').setValue(this.dataCliente.nombre);

    // this.myForm.disable(); // *** Geo ***
    // console.log('Show:', this.myForm.value);
  }



  //================================================================================
  // SUCCESSFUL MESSAGE
  //================================================================================

  async mensajeExito() {
    const toast = await this.toastCtrl.create({
      header: 'Cliente agregado exitosamente',
      message: 'Ahora usted puede puede ordenar.',
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      color: 'dark',
      duration: 5000
    });
    toast.present();
  }
  //================================================================================
  // ERROR MESSAGE
  //================================================================================

  async mensajeError() {
    const toast = await this.toastCtrl.create({
      header: 'Error:',
      message: 'Error al agregar cliente, intentelo nuevamente.',
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      color: 'danger',
      duration: 5000
    });
    toast.present();
  }


  //================================================================================
  // NEED BILL
  //================================================================================

  onCheck(event) {
    // this.check = event.detail.checked;
    console.log('Factura:', event.detail.checked);
    this.factura_check = event.detail.checked;
    // console.log('Factura:', this.factura_check.toString());
    localStorage.setItem('factura', this.factura_check.toString());
    // this.hiddenDate = !event.detail.checked;
    // if (event.detail.checked) {
    //   console.log(event.detail.checked);
    //   this.validateDate = !event.detail.checked; // False
    //   this.validateTime = !event.detail.checked; // False
    //   this.myForm.get('tipo').setValue(true);
    // } else {
    //   console.log(event.detail.checked);
    //   this.validateDate = !event.detail.checked; // True
    //   this.validateTime = !event.detail.checked; // True
    //   this.myForm.get('fecha').setValue('');
    //   this.myForm.get('hora').setValue('');
    //   this.myForm.get('tipo').setValue(false);
    // }
  }





}
