import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-consultar-paciente',
  imports: [ButtonModule, SelectButtonModule, FormsModule, InputMaskModule, InputTextModule],
  templateUrl: './consultar-paciente.component.html',
  styleUrl: './consultar-paciente.component.scss'
})
export class ConsultarPacienteComponent {
  podeEditar: boolean = false;

  alternarEdicao() {
    this.podeEditar = !this.podeEditar;
  }

  stateOptions = [
    { label: 'Histórico', value: true },
    { label: 'Pendentes', value: false }
  ];

  value: boolean = true;

  // Função para buscar dados conforme a opção selecionada
  buscarDados() {
    if (this.value == true) {
      console.log("Buscando dados de Histórico..."); // Buscar vacinas realizada
    } else {
      console.log("Buscando dados de Pendentes..."); // Buscar vacinas pendentes
    }
  }
}
