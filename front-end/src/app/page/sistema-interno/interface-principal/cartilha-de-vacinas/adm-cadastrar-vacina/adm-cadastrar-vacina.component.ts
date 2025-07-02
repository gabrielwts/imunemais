import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

interface AgeRange {
  name: string;
  code: string;
}

@Component({
  selector: 'app-adm-cadastrar-vacina',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './adm-cadastrar-vacina.component.html',
  styleUrls: ['./adm-cadastrar-vacina.component.css']
})
export class AdmCadastrarVacinaComponent {
  ageRanges: AgeRange[] = [
    { name: '0-5 anos', code: '0-5' },
    { name: '6-12 anos', code: '6-12' },
    { name: '13-18 anos', code: '13-18' },
    { name: 'Adulto', code: 'adulto' }
  ];

  selectedAgeRange?: AgeRange;

  vacinaNome = '';

  cadastrarVacina() {
    if (!this.vacinaNome || !this.selectedAgeRange) {
      alert('Preencha todos os campos!');
      return;
    }
    // Chamada API para salvar vacina
    console.log('Vacina cadastrada:', this.vacinaNome, this.selectedAgeRange);
    alert('Vacina cadastrada com sucesso!');
    this.limparCampos();
  }

  limparCampos() {
    this.vacinaNome = '';
    this.selectedAgeRange = undefined;
  }
}
