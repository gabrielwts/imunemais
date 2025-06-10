import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sistema-enfermeiro',
  imports: [FormsModule, CommonModule],
  templateUrl: './sistema-enfermeiro.component.html',
  styleUrl: './sistema-enfermeiro.component.scss'
})
export class SistemaEnfermeiroComponent {
  selectedSection: string = '';
  showFuncionarioDetails: boolean = false;

  nomeFuncionario: string = '';
  usuarioFuncionario: string = '';
  senhaFuncionario: string = '';
  cargoFuncionario: string = '';
  fotoFuncionario: string = '';

  showSection(sectionId: string): void {
    this.selectedSection = sectionId;
    this.showFuncionarioDetails = false;
  }

  mostrarDetalhesFuncionario(nome: string, usuario: string, senha: string, cargo: string, foto: string): void {
    this.nomeFuncionario = nome;
    this.usuarioFuncionario = usuario;
    this.senhaFuncionario = senha;
    this.cargoFuncionario = cargo;
    this.fotoFuncionario = foto;

    this.showFuncionarioDetails = true;
  }
}
