import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultar-paciente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultar-paciente.component.html',
  styleUrls: ['./consultar-paciente.component.css']
})
export class ConsultarPacienteComponent {
  validarVacina = false;
  removerValidacaoAtiva = false;

  validar() {
    this.validarVacina = true;
    this.removerValidacaoAtiva = false;
  }

  removerValidacao() {
    this.removerValidacaoAtiva = true;
    this.validarVacina = false;
  }
}
