import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CadastrarProfissionalComponent } from './cadastrar-profissional/cadastrar-profissional.component';

@Component({
  selector: 'app-adm-profissionais-cadastrados',
  imports: [InputTextModule, FormsModule, FloatLabelModule, ButtonModule, CommonModule, CadastrarProfissionalComponent],
  templateUrl: './adm-profissionais-cadastrados.component.html',
  styleUrl: './adm-profissionais-cadastrados.component.scss'
})
export class AdmProfissionaisCadastradosComponent {
  cadastrar: boolean = true;

  alternarEdicao() {
    this.cadastrar = !this.cadastrar;
  }

}
