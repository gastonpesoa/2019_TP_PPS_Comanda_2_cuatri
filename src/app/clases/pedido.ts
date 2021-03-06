import { ProductoPedido } from "./producto-pedido";
import { Mesa } from './mesa';

export class Pedido {
         public key: string;
         public mesa: Mesa;
         public numeroMesa: number;
         public estado: string;
         public estadoCocinero: string;
         public estadoBartender: string;
         public productoPedido: Array<ProductoPedido>;
         public isDelivery: boolean;
         public responsableCocinero: string;
         public responsableBartender: string;
         public tiempoDeEsperaCocinero: number;
         public tiempoDeEsperaBartender: number;
         public horaDeEntrega: string;
       }
