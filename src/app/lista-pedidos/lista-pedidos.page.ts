import { Component, OnInit } from "@angular/core";
import { AuthService } from "../servicios/auth.service";
import { MesasService } from "../servicios/mesas.service";
import { TomarPedidoService } from '../servicios/tomar-pedido.service';
import { FirebaseService } from '../servicios/firebase.service';

@Component({
  selector: "app-lista-pedidos",
  templateUrl: "./lista-pedidos.page.html",
  styleUrls: ["./lista-pedidos.page.scss"]
})
export class ListaPedidosPage implements OnInit {
  public pedidos: any;
  public mostrarSpinner: boolean = false;
  constructor(
    public fireServ: FirebaseService,
    public tomarPedidoServ: TomarPedidoService,
    public authServ: AuthService,
    public mesasServ: MesasService
  ) { }

  ngOnInit() {
    this.tomarPedidoServ.TraerPedidos().subscribe(pedidos => {
      if (pedidos != null && pedidos.length != 0) {
        pedidos.map(pedido => {
          this.mesasServ.TraerMesa(pedido.mesa).then(mesa => {
            pedido.numeroMesa = mesa.numero;
          })
        })
        this.pedidos = pedidos;
      }
    });
  }

  AceptarPedido(pedidoInfo) {
    this.tomarPedidoServ.AceptarPedido(pedidoInfo.key).then(() => {
      console.log("Regreso del AceptarPedido");
    });
  }

  RechazarPedido(pedidoInfo) {
    this.tomarPedidoServ.RechazarPedido(pedidoInfo.key)
  }

  EntregarPedido(pedidoInfo) {
    this.tomarPedidoServ.EntregarPedidoMozo(pedidoInfo.key).then(() => {
      console.log("Regreso del EntregarPedidoMozo");
    });
  }

  // ConfirmarPago(pedidoInfo){
  //   this.tomarPedidoServ.ConfirmarPago(pedidoInfo.key).then(() => {
  //     console.log("Regreso del CerrarPedido");
  //   });
  // }

  CerrarPedido(pedidoInfo) {
    this.tomarPedidoServ.CerrarPedido(pedidoInfo.key).then(() => {
      console.log("Regreso del CerrarPedido");
      this.mesasServ.TraerMesa(pedidoInfo.mesa).then(data => {

        this.fireServ.traerUno('esperaMesa', 'idUsuario', data.ocupante).then(res => {
          console.log('user lista espera', res)
          console.log('user lista espera', res.id)
          this.fireServ.borrar('esperaMesa', res.id)
          // this.tomarPedidoServ.BorrarDeEspera(res.id);
          this.mesasServ.LiberarMesa(pedidoInfo.mesa).then(() => {
            console.log("Regreso del CerrarPedido");
          });
        })
        
      })
    });
  }
}
