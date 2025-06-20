import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CadastrarProfissionalComponent } from './cadastrar-profissional/cadastrar-profissional.component';
import { AlterarDadosProfissionalComponent } from './alterar-dados-profissional/alterar-dados-profissional.component';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-adm-profissionais-cadastrados',
  imports: [InputTextModule, FormsModule, FloatLabelModule, SelectModule, ButtonModule, CommonModule, CadastrarProfissionalComponent, AlterarDadosProfissionalComponent],
  templateUrl: './adm-profissionais-cadastrados.component.html',
  styleUrl: './adm-profissionais-cadastrados.component.scss'
})
export class AdmProfissionaisCadastradosComponent {
  cadastrar: boolean = false;
  alterarPerfil: boolean = false; 

  cadastrarUser() {
    this.cadastrar = !this.cadastrar;
  }
  alterarUserProfile() {
    this.alterarPerfil = !this.alterarPerfil;
  }

}
