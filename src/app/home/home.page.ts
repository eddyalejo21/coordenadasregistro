import { Component, OnInit } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { PuntosBacheo } from '../_model/puntosBacheo';
import { RegistrarService } from '../services/registrar.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  latitud: number;
  longitud: number;
  fecha: number;
  loading: HTMLIonLoadingElement

  constructor( 
    public geolocation: Geolocation, 
    private registrarService: RegistrarService,
    public toastController: ToastController
    ) {
  }

  OnInit(){
  }

  getCoordenadas() {
    this.geolocation.getCurrentPosition().then((resp: Geoposition) => {

      this.latitud = resp.coords.latitude;
      this.longitud = resp.coords.longitude;
      this.fecha = resp.timestamp;
      console.log(this.latitud, this.longitud)
    }).catch((error) => {
      console.log('Error getting location', error);
    });   
  }

  registrarPunto() {
    try {
      let punto = new PuntosBacheo();

      if(this.latitud && this.longitud){
        punto.punLatitud = this.latitud.toString()
        punto.punLongitud = this.longitud.toString()
        punto.punFecha = this.fecha.toString()
        punto.punEstado = 'R'
        punto.punEstadoAh = 'A'
    
          this.registrarService.registrar(punto).subscribe();
          this.latitud = null;
          this.longitud = null;
          this.fecha = null;
          this.presentToast();
      }else{
          this.presentToastFalso();
      }
    } catch (error) {
      console.log("No se puede enviar información")
    }
      
  }
  
  limpiarData(){
    this.latitud = null;
    this.longitud = null;
    this.fecha = null;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Registro Exitoso',
      duration: 4000,
      color: "warning",
      position: "top"
    });
    toast.present();
  }

  async presentToastFalso() {
    const toast = await this.toastController.create({
      message: 'No se puede enviar información vacia',
      duration: 4000,
      color: "danger",
      position:"top"
    });
    toast.present();
  }

}
