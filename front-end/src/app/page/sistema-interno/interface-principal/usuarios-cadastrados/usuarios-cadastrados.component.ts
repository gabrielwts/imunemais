import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { EnfermeirosService } from '../../../../services/enfermeiros.service';
import { Router } from '@angular/router';
import { DataTransferService } from '../../../../services/compartilhado/data-transfer.service';

@Component({
  selector: 'app-usuarios-cadastrados',
  imports: [InputTextModule, FormsModule, FloatLabelModule, ButtonModule, CommonModule],
  templateUrl: './usuarios-cadastrados.component.html',
  styleUrl: './usuarios-cadastrados.component.scss'
})
export class UsuariosCadastradosComponent implements OnInit {
  pacientes: { nome_completo: string; cpf: string }[] = [];

  constructor(private enfermeiroService: EnfermeirosService, private dataTransfer: DataTransferService, private router: Router) {}

  filtroPesquisa: string = '';
  pacientesFiltrados: { nome_completo: string; cpf: string }[] = [];

  acessarPaciente(cpf: string) {
  this.dataTransfer.setCpf(cpf);

  const event = new CustomEvent('abrirConsultaPaciente', { bubbles: true });
    window.dispatchEvent(event);
  }

  ngOnInit(): void {
    this.enfermeiroService.getTodosUsuariosCadastrados().subscribe({
      next: (dados) => {
        this.pacientes = dados;
        this.pacientesFiltrados = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar pacientes:', erro);
      }
    });
  }

  filtrarPaciente() {
    const termoBusca = this.filtroPesquisa.trim().toLowerCase();

    this.pacientesFiltrados = this.pacientes.filter(p => 
      p.nome_completo.toLowerCase().includes(termoBusca)
    );
  }
  
}