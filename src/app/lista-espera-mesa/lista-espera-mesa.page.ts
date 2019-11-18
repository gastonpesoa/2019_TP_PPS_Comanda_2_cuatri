import { Component, OnInit } from '@angular/core';
import { BarcodeService } from '../servicios/barcode.service';
import { UsuariosService } from '../servicios/usuarios.service';
import { Usuario } from '../clases/Usuario';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { ToastService } from '../servicios/toast.service';

@Component({
  selector: 'app-lista-espera-mesa',
  templateUrl: './lista-espera-mesa.page.html',
  styleUrls: ['./lista-espera-mesa.page.scss'],
})
export class ListaEsperaMesaPage implements OnInit {

  usuario: Usuario;
  listaEspera;

  constructor(
    private router: Router,
    private usrServ: UsuariosService, 
    private barcode: BarcodeScanner,
    private toast: ToastService) {

    this.TraerLista();

  }

  TraerLista() {
    this.usrServ.TraerEsperasPendientes().subscribe((data) => {
      this.listaEspera= data;
      console.log(this.listaEspera)
    });
  }

  asignarMesa(usuario) {
    const options = { prompt: 'Escaneá el código QR de la mesa' };
    this.barcode.scan(options)
      .then(barcodeData => {
        const auxMesa = barcodeData.text;
        this.router.navigate(['reservar-mesa', { mesa: auxMesa, reserva: JSON.stringify(usuario), tipo: 'esperaMesa' }]);
      }, (err) => {
        // // datos hardcodeados para testear
        // const auxMesa = 'mesa02';
        // this.router.navigate(['reservar-mesa', { mesa: auxMesa, reserva: JSON.stringify(reserva) }]);
        // this.messageHandlerServ.mostrarError(err, 'Ocurrió un error');
      });
  }

  cancelarEspera(registro){

    this.usrServ.CancelarRegistro(registro).then(()=>{
      this.toast.confirmationToast("Se borro el registro.");
    }).catch(()=>{
      this.toast.errorToast("No se pudo borrar el registro.");
    })
  }

  AceptarRegistro(registro)
  {
    this.usrServ.AceptarRegistro(registro).then(()=>{
      this.toast.confirmationToast("Registro aceptado.");
    }).catch(()=>{
      this.toast.errorToast("No se pudo aceptar el registro.")
    })
  }

  ngOnInit() {
  }

}
