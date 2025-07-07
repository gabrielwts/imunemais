import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { EnfermeirosService } from '../../../../services/enfermeiros.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-consultar-paciente',
  imports: [CommonModule, ButtonModule, SelectButtonModule, FormsModule, InputMaskModule, InputTextModule],
  templateUrl: './consultar-paciente.component.html',
  styleUrl: './consultar-paciente.component.scss'
})

export class ConsultarPacienteComponent implements OnInit {
  paciente = {
    cpf: '',
    nome_completo: '',
    data_nascimento: '',
    telefone: '',
    email: ''
  };

  stateOptions = [
    { label: 'Histórico', value: true },
    { label: 'Pendentes', value: false }
  ];

  value: boolean = true;

  podeEditar: boolean = false;
  validarVacina: boolean = false;
  removerValidacaoVacina: boolean = false;

  constructor(private enfermeiroService: EnfermeirosService, router: Router) {}

  buscarDadosPaciente() {
    const cpfLimpo = this.paciente.cpf;
    console.log('Buscando CPF:', cpfLimpo);

    if (cpfLimpo) {
      this.enfermeiroService.getUsuariosPorCpf(cpfLimpo).subscribe({
        next: (res) => {
          console.log('Resposta do backend:', res);

          if (res && res.dados_pessoais) {
            const dados = res;

            this.paciente.nome_completo = dados.dados_pessoais.nome_completo;
            this.paciente.data_nascimento = dados.dados_pessoais.data_nascimento;
            this.paciente.telefone = dados.dados_pessoais.telefone;
            this.paciente.email = dados.dados_pessoais.email;

            this.vacinasListagem = dados.vacinas || [];
          } else {
            alert('Paciente não encontrado');
          }
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao buscar paciente');
        }
      });
    }
  }

  cpfDigitado: string = '';
  vacinasListagem: any[] = []; 

  get vacinasFiltradas(): any[] {
  return this.vacinasListagem.filter(v => {
    const validacao = v.validacao === true || v.validacao === 'true';
    return this.value ? validacao : !validacao;
  });
}
  
  ngOnInit(): void {
    console.log("ConsultarPacienteComponent carregado");
  }

  confirmValidarVacina () {
    this.validarVacina = !this.validarVacina;
  }

  confirmRemoverVacina () {
    this.removerValidacaoVacina = !this.removerValidacaoVacina;
  }

  aoDigitarCpf(valor: string) {
    if (!valor || valor.trim() === '') {
      this.limparCamposPaciente();
    }
  }

  limparCamposPaciente() {
    this.paciente = {
      cpf: '',
      nome_completo: '',
      data_nascimento: '',
      telefone: '',
      email: ''
    };
    this.vacinasListagem = [];
  }

  alternarEdicao() {
    this.podeEditar = !this.podeEditar;
  }

  salvarAlteracoes() {
    const dadosAtualizados = {
      cpf: this.paciente.cpf,
      nome_completo: this.paciente.nome_completo,
      data_nascimento: this.paciente.data_nascimento,
      telefone: this.paciente.telefone,
      email: this.paciente.email
    };

    console.log('Enviando para o backend:', dadosAtualizados);

    this.enfermeiroService.atualizarDadosPaciente(dadosAtualizados).subscribe({
      next: (res) => {
        console.log('Resposta do backend:', res);
        alert('Dados atualizados com sucesso!');
        this.podeEditar = false;
      },
      error: (err) => {
        console.error('Erro ao atualizar dados:', err);
        alert('Erro ao atualizar dados');
      }
    });
  }

}