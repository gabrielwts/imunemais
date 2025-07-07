import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule, Select } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EnfermeirosService } from '../../../../services/enfermeiros.service';

interface AgeRange {
  name: string;
}

@Component({
  selector: 'app-cartilha-de-vacinas',
  imports: [InputTextModule, CommonModule, FormsModule, FloatLabelModule, ButtonModule, SelectModule, Select],
  templateUrl: './cartilha-de-vacinas.component.html',
  styleUrl: './cartilha-de-vacinas.component.scss'
})
export class CartilhaDeVacinasComponent implements OnInit {
  cadastrarVac: boolean = false;
  cargo: string = '';
  usuario: string = "";
  vacinas: { vacinas_nome: string, descricao: string, faixa_etaria: string, doses: string }[] = [];
  
  constructor(private enfermeiroService: EnfermeirosService, private router: Router) {}
  
  cadastrarVacina() {
    this.cadastrarVac = !this.cadastrarVac;
  }

  ageRanges: AgeRange[] = []; 
  selectedAgeRange: AgeRange | null = null;
  vacinasFiltradas: typeof this.vacinas = [];
  filtroPesquisa: string = '';
  
  ngOnInit() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const dados = JSON.parse(usuario);
      this.cargo = dados.profissional; // aqui pega "Profissional"
      console.log('Cargo:', this.cargo);
    }

    this.enfermeiroService.getTodasAsVacinasCadastradas().subscribe({
      next: (dados) => {
        this.vacinas = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar pacientes:', erro);
      }
    });

    this.enfermeiroService.getTodasAsVacinasCadastradas().subscribe(data => {
      this.vacinas = data;
      this.vacinasFiltradas = data;
    });

    this.ageRanges = [
      { name: 'Adolescente' },
      { name: 'Adulto', },
      { name: 'Criança' },
      { name: 'Gestante' },
      { name: 'Idoso' }
    ];
  }

  filtrarPorFaixaEtaria() {
    if (this.selectedAgeRange) {
      this.vacinasFiltradas = this.vacinas.filter(
        vacina => vacina.faixa_etaria === this.selectedAgeRange?.name
      );
    } else {
      this.vacinasFiltradas = this.vacinas;
    }
  }

  filtrarVacinas() {
    const faixaSelecionada = this.selectedAgeRange?.name?.toLowerCase() || '';
    const termoBusca = this.filtroPesquisa.trim().toLowerCase();

    this.vacinasFiltradas = this.vacinas.filter(vacina => {
      const nomeMatch = vacina.vacinas_nome.toLowerCase().includes(termoBusca);
      const faixaMatch = faixaSelecionada ? vacina.faixa_etaria.toLowerCase() === faixaSelecionada : true;
      return nomeMatch && faixaMatch;
    });
  }


}