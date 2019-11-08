import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../clases/Usuario';
import { MailService } from './mail.service';
import { RegistroEspera } from '../clases/RegistroEspera';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuariosFirebase: AngularFirestoreCollection<any>;
  public usuariosObservable: Observable<any>;


  dbRef: AngularFirestoreCollection<any>;

  constructor(private objFirebase: AngularFirestore) {
    this.dbRef = this.objFirebase.collection("usuarios");
  }

  saveUsuario(usuario) {
    let id = this.objFirebase.createId();
    usuario.id = id;
    return this.dbRef.doc(id).set(usuario);

  }

  TraerUsuariosPendientes()
  {
    this.usuariosFirebase = this.objFirebase.collection<Usuario>("usuarios", ref => ref.where("estado", "==", "pendiente"));
    this.usuariosObservable = this.usuariosFirebase.valueChanges();
    return this.usuariosObservable;

  }

  BorrarUsuario(usr:Usuario)
  {
    return this.objFirebase.collection<any>("usuarios").doc(usr.id).delete();
  }


  TraerUsuarios() {
    this.usuariosFirebase = this.objFirebase.collection<Usuario>("usuarios", ref => ref.orderBy('correo', 'asc'));
    this.usuariosObservable = this.usuariosFirebase.valueChanges();
    return this.usuariosObservable;
  }

  GuardarUsuario(usuario) {

    let id = this.objFirebase.createId();
    usuario.id = id;


   return this.objFirebase.collection<any>("usuarios").doc(id).set(usuario);

  }

  CambiarEstado(usr:Usuario)
  {
    usr.estado="pendiente";
    return this.objFirebase.collection<any>("usuarios").doc(usr.id).update(usr);
  }

   async TraerListaEsperaMesa()
  {

    this.usuariosFirebase = this.objFirebase.collection<RegistroEspera>("esperaMesa", ref => ref.orderBy('fecha', 'asc'));
    this.usuariosObservable = this.usuariosFirebase.valueChanges();
    return this.usuariosObservable;
  }

  AgregarListaEsperaMesa(usr)
  {
   let registro= {
      fecha: Date.now(),
      nombre: usr.nombre,
      apellido: usr.apellido,
      correo: usr.correo,
      foto:usr.foto
    }
   return this.objFirebase.collection<any>("esperaMesa").add(registro);
  }
}
