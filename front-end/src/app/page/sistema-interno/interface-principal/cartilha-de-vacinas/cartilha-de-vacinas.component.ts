import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule, Select } from 'primeng/select';

interface AgeRange {
  name: string;
  code: string;
}

@Component({
  selector: 'app-cartilha-de-vacinas',
  imports: [InputTextModule, FormsModule, FloatLabelModule, ButtonModule, SelectModule, Select],
  templateUrl: './cartilha-de-vacinas.component.html',
  styleUrl: './cartilha-de-vacinas.component.scss'
})
export class CartilhaDeVacinasComponent {
  ageRanges: AgeRange[] = [];         // Lista de opções
  selectedAgeRange: AgeRange | null = null; // Item selecionado

  ngOnInit() {
    this.ageRanges = [
      { name: 'Adolescente', code: '11' },
      { name: 'Adulto', code: '200' },
      { name: 'Criança', code: '33' },
      { name: 'Gestante', code: '40' },
      { name: 'Idoso', code: '555' }
    ];
  }
}
