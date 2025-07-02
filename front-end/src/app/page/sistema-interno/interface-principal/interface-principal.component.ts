import { Component } from '@angular/core';

import { ConsultarPacienteComponent } from '../src/app/page/sistema-interno/interface-principal/consultar-paciente.component';
import { UsuariosCadastradosComponent } from '../usuarios-cadastrados/usuarios-cadastrados.component';
import { CartilhaDeVacinasComponent } from '../cartilha-de-vacinas/cartilha-de-vacinas.component';
import { AdmProfissionaisCadastradosComponent } from '../adm-profissionais-cadastrados/adm-profissionais-cadastrados.component';

@Component({
  selector: 'app-interface-principal',
  standalone: true,
  templateUrl: './interface-principal.component.html',
  styleUrls: ['./interface-principal.component.css'],
  imports: [
    ConsultarPacienteComponent,
    UsuariosCadastradosComponent,
    CartilhaDeVacinasComponent,
    AdmProfissionaisCadastradosComponent,
  ],
})
export class InterfacePrincipalComponent {
  pacienteDados = false;
  pacientesLista = false;
  vacinasLista = false;
  funcinariosLista = false;

  constructor() {
    this.mostrarPaciente();
  }

  private resetarTelas() {
    this.pacienteDados = false;
    this.pacientesLista = false;
    this.vacinasLista = false;
    this.funcinariosLista = false;
  }

  mostrarPaciente() {
    this.resetarTelas();
    this.pacienteDados = true;
  }

  mostrarUsuarios() {
    this.resetarTelas();
    this.pacientesLista = true;
  }

  mostrarVacinas() {
    this.resetarTelas();
    this.vacinasLista = true;
  }

  mostrarFuncionarios() {
    this.resetarTelas();
    this.funcinariosLista = true;
  }
}
