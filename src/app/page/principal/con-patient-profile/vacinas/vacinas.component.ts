import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';


@Component({
  selector: 'app-vacinas',
  imports: [ButtonModule, SelectButtonModule, FormsModule],
  templateUrl: './vacinas.component.html',
  styleUrl: './vacinas.component.scss'
})
export class VacinasComponent {
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
