import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule, Select } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EnfermeirosService } from '../../../../services/enfermeiros.service';
import { LoginAdminService } from '../../../../services/admin.service';
import { AdmCadastrarVacina } from '../../../../models/adm_models/adm-cadastrar-vacina';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

interface AgeRange {
  name: string;
}

@Component({
  selector: 'app-cartilha-de-vacinas',
  imports: [InputTextModule, CommonModule, FormsModule, FloatLabelModule, ButtonModule, SelectModule, Select, ToastModule, RippleModule],
  templateUrl: './cartilha-de-vacinas.component.html',
  styleUrl: './cartilha-de-vacinas.component.scss',
  providers: [MessageService]
})
export class CartilhaDeVacinasComponent implements OnInit {
  form!: AdmCadastrarVacina;
  cadastrarVac: boolean = false;
  cargo: string = '';
  usuario: string = "";
  vacinas: { vacinas_nome: string, descricao: string, faixa_etaria: string, doses: string }[] = [];
  botaoDesativado = false;
  
  constructor(private enfermeiroService: EnfermeirosService, private adminService: LoginAdminService, private messageService: MessageService, private router: Router) {
    this.form = new AdmCadastrarVacina();
  }

  cadastrarVacinaSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Cadastro realizado!', detail: 'Vacina cadastrada com sucesso!', life: 3000 });
  }

  cadastrarVacinaError() {
    this.messageService.add({ severity: 'error', summary: 'Erro ao cadastrar!', detail: 'Não foi possível cadastrar a vacina, verifique os dados antes do envio.' });
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.cadastrarVac) {
      this.cadastrarVac = false;
    }
  }
  
  cadastrarVacina() {
    this.cadastrarVac = !this.cadastrarVac;
  }

  ageRanges: AgeRange[] = [];
  selectedAgeRange: AgeRange | null = null;
  selectedInputAgeRange: AgeRange | null = null;
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
  
  salvar(){
    const nome = this.form.vacinas_nome?.trim();
    const descricao = this.form.descricao?.trim();
    const faixaEtaria = this.form.faixa_etaria;
    const dose = this.form.doses?.trim();

    if (!nome || !descricao || !faixaEtaria || !dose) {
      this.messageService.add({
        severity: 'error',
        summary: 'Campos obrigatórios',
        detail: 'Preencha todos os campos antes de salvar.'
      });
      return;
    }

    this.botaoDesativado = true;
    this.adminService.cadastrar(this.form).subscribe({
      next: adminService => {
        this.cadastrarVacinaSuccess()
        this.form = new AdmCadastrarVacina();
        this.enfermeiroService.getTodasAsVacinasCadastradas().subscribe(data => {
          this.vacinas = data;
          this.vacinasFiltradas = data; // mantém o filtro atualizado também
        });
      },
      error: erro => {
        this.cadastrarVacinaError()
        console.error("Erro ao tentar cadastrar:", erro);
        console.error("Detalhe do erro:", erro.error);
      }
    })
    setTimeout(() => {
      this.botaoDesativado = false;
    }, 3000);
  }

}