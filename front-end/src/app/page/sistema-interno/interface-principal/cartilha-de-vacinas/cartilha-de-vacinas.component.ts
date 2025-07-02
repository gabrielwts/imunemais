import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-cartilha-de-vacinas',
  templateUrl: './cartilha-de-vacinas.component.html',
  standalone: true,
  imports: [FormsModule, ButtonModule, DropdownModule, InputTextModule],
})
export class CartilhaDeVacinasComponent {
  ageRanges = [
    { name: '0 a 5 anos', code: '0-5' },
    { name: '6 a 12 anos', code: '6-12' },
    { name: '13 a 18 anos', code: '13-18' },
    { name: 'Adulto', code: 'adult' },
    { name: 'Idoso', code: 'elderly' }
  ];

  selectedAgeRange: any = null;
  searchTerm: string = '';
  cadastrarVac: boolean = false;

  vacinas = [
    // Aqui você pode carregar vacinas do backend e filtrar
    { nome: 'Vacina A', descricao: 'Descrição A', dose: 'Dose 1', faixaEtaria: 'adult' },
    { nome: 'Vacina B', descricao: 'Descrição B', dose: 'Dose 2', faixaEtaria: '0-5' },
  ];

  cadastrarVacina() {
    this.cadastrarVac = true;
  }

  filtrarVacinas() {
    const termo = this.searchTerm.toLowerCase();
    return this.vacinas.filter(v => v.nome.toLowerCase().includes(termo));
  }
}
