import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartilhaDeVacinasComponent } from './cartilha-de-vacinas/cartilha-de-vacinas.component';
import { ConsultarPacienteComponent } from './consultar-paciente/consultar-paciente.component';
import { UsuariosCadastradosComponent } from './usuarios-cadastrados/usuarios-cadastrados.component';
import { AdmProfissionaisCadastradosComponent } from "./adm-profissionais-cadastrados/adm-profissionais-cadastrados.component";

@Component({
  selector: 'app-interface-principal',
  imports: [FormsModule, CommonModule, ConsultarPacienteComponent, UsuariosCadastradosComponent, CartilhaDeVacinasComponent, UsuariosCadastradosComponent, AdmProfissionaisCadastradosComponent],
  templateUrl: './interface-principal.component.html',
  styleUrl: './interface-principal.component.scss'
})

export class InterfacePrincipalComponent {
  pacienteDados: boolean = true;
  mostrarPaciente () {
    this.pacienteDados = true;
    this.pacientesLista = false;
    this.vacinasLista = false;
    this.funcinariosLista = false;
    console.log("Acessou perfil")
  }
  pacientesLista: boolean = false;
  mostrarUsuarios () {
    this.pacienteDados = false;
    this.pacientesLista = true;
    this.vacinasLista = false;
    this.funcinariosLista = false;
    console.log("Acessou usuários cadastrados")
  }
  vacinasLista: boolean = false;
  mostrarVacinas () {
    this.pacienteDados = false;
    this.pacientesLista = false;
    this.vacinasLista = true;
    this.funcinariosLista = false;
    console.log("Acessou lista de vacinas")
  }
  funcinariosLista: boolean = false;
  mostrarFuncionarios () {
    this.pacienteDados = false;
    this.pacientesLista = false;
    this.vacinasLista = false;
    this.funcinariosLista = true;
    console.log("Acessou funcionários cadastrados")
  }
}