import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule, Select } from 'primeng/select';
import { AdmCadastrarVacinaComponent } from './adm-cadastrar-vacina/adm-cadastrar-vacina.component';

interface AgeRange {
  name: string;
}

@Component({
  selector: 'app-cartilha-de-vacinas',
  imports: [InputTextModule, FormsModule, FloatLabelModule, ButtonModule, SelectModule, Select, AdmCadastrarVacinaComponent],
  templateUrl: './cartilha-de-vacinas.component.html',
  styleUrl: './cartilha-de-vacinas.component.scss'
})
export class CartilhaDeVacinasComponent {
  cadastrarVac: boolean = false;

  cadastrarVacina() {
    this.cadastrarVac = !this.cadastrarVac;
  }

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