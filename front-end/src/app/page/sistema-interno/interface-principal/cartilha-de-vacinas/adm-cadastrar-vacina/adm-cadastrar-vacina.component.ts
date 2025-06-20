import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule, Select } from 'primeng/select';

interface AgeRange {
  name: string;
}

@Component({
  selector: 'app-adm-cadastrar-vacina',
  imports: [InputTextModule, FormsModule, FloatLabelModule, ButtonModule, SelectModule, Select],
  templateUrl: './adm-cadastrar-vacina.component.html',
  styleUrl: './adm-cadastrar-vacina.component.scss'
})
export class AdmCadastrarVacinaComponent {

  // SELECIONAR VACINAS POR FAIXA ETÁRIA
  ageRanges: AgeRange[] = [];         // Lista de opções
  selectedAgeRange: AgeRange | null = null; // Item selecionado

  ngOnInit() {
    this.ageRanges = [
      { name: 'Adolescente' },
      { name: 'Adulto', },
      { name: 'Criança' },
      { name: 'Gestante' },
      { name: 'Idoso' }
    ];
  }
}
