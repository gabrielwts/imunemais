import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { EnfermeirosService } from '../../../../services/enfermeiros.service';
import { Router } from '@angular/router';
import { AdmEnfermeirosStatusVacina } from '../../../../models/adm_models/adm-enfermeiros-status-vacina';
import { DataTransferService } from '../../../../services/compartilhado/data-transfer.service';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-consultar-paciente',
  imports: [CommonModule, ButtonModule, SelectButtonModule, FormsModule, InputMaskModule, InputTextModule, ToastModule, RippleModule],
  templateUrl: './consultar-paciente.component.html',
  styleUrl: './consultar-paciente.component.scss',
  providers: [MessageService]
})

export class ConsultarPacienteComponent implements OnInit {
  paciente = {
    cpf: '',
    nome_completo: '',
    data_nascimento: '',
    telefone: '',
    email: '',
    imagem_perfil: ''
  };

  cpfOriginal: string = '';

  stateOptions = [
    { label: 'Histórico', value: true },
    { label: 'Pendentes', value: false }
  ];

  value: boolean = true;

  podeEditar: boolean = false;
  validarVacina: boolean = false;
  removerValidacaoVacina: boolean = false;

  constructor(private enfermeiroService: EnfermeirosService, private dataTransfer: DataTransferService, private messageService: MessageService, router: Router) {}

  getImagemCompleta(): string {
    const baseUrl = 'http://localhost:8000';
    if (this.paciente.imagem_perfil?.startsWith('/static')) {
      return baseUrl + this.paciente.imagem_perfil;
    }
    return '/standard-user.jpg'; // ou outro caminho local padrão
  }

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Paciente não encontrado!', detail: 'CPF inválido ou paciente não cadastrado, confirme o CPF.', life: 3000 });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Alterações realizadas!', detail: 'Dados atualizados com sucesso.', life: 3000 });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Erro ao alterar dados!', detail: 'Verifique os dados antes do envio.' });
  }

  vacinaSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Validação realizada!', detail: 'Vacina validada com sucesso!.', life: 3000 });
  }

  vacinaError() {
    this.messageService.add({ severity: 'error', summary: 'Erro ao validar vacina!', detail: 'Não foi possível realizar a validação da vacina.' });
  }

  removeVacinaSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Remoção realizada!', detail: 'Validação removida com sucesso!', life: 3000 });
  }

  removeVacinaError() {
    this.messageService.add({ severity: 'error', summary: 'Erro ao remover validação da vacina!', detail: 'Não foi possível realizar a remoção da vacina.' });
  }

  @HostListener('document:keydown.escape', ['$event'])
    handleEscape(event: KeyboardEvent) {
      if (this.validarVacina) {
        this.validarVacina = false;
      }

      if (this.removerValidacaoVacina) {
        this.removerValidacaoVacina = false;
      }

      if (this.podeEditar) {
        this.podeEditar = false;
      }
    }

  buscarDadosPaciente() {
    const cpfLimpo = this.paciente.cpf;
    // console.log('Buscando CPF:', cpfLimpo);

    if (cpfLimpo) {
      this.enfermeiroService.getUsuariosPorCpf(cpfLimpo).subscribe({
        next: (res) => {
          // console.log('Resposta do backend:', res);

          if (res && res.dados_pessoais) {
            const dados = res;

            this.paciente.nome_completo = dados.dados_pessoais.nome_completo;
            this.paciente.data_nascimento = this.formatarDataParaInput(dados.dados_pessoais.data_nascimento);
            this.paciente.telefone = dados.dados_pessoais.telefone;
            this.paciente.email = dados.dados_pessoais.email;
            this.paciente.imagem_perfil = dados.dados_pessoais.imagem_perfil;

            this.vacinasListagem = dados.vacinas || [];
          } else {
            this.showWarn()
          }
        },
        error: (err) => {
          console.error(err);
          this.showWarn()
        }
      });
    }
  }

  formatarDataParaInput(dataISO: string): string {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  formatarDataParaISO(dataBR: string): string {
    const [dia, mes, ano] = dataBR.split('/');
    return `${ano}-${mes}-${dia}`;
  }

  validarVacinaSelecionada() {
    if (!this.vacinaSelecionada || !this.paciente.cpf) return;

    const payload = new AdmEnfermeirosStatusVacina(
      this.paciente.cpf,
      this.vacinaSelecionada.nome_vacina,
      'REALIZADA'
    );

    this.enfermeiroService.atualizarStatusVacina(payload).subscribe({
      next: (res) => {
        console.log(res.mensagem);
        this.validarVacina = false;
        this.vacinaSelecionada.validacao = 'true';
        this.vacinaSuccess()
        this.buscarDadosPaciente();
        this.value = true;
      },
      error: (err) => {
        console.error(err);
        this.vacinaError()
      }
    });
  }

  removerValidacaoVacinaSelecionada() {
    if (!this.vacinaSelecionada || !this.paciente.cpf) return;

    const payload = new AdmEnfermeirosStatusVacina(
      this.paciente.cpf,
      this.vacinaSelecionada.nome_vacina,
      'PENDENTE'
    );

    this.enfermeiroService.atualizarStatusVacina(payload).subscribe({
      next: (res) => {
        console.log(res.mensagem);
        this.removerValidacaoVacina = false;
        this.vacinaSelecionada.validacao = 'false';

        this.buscarDadosPaciente();
        this.value = false;
        this.removeVacinaSuccess()
      },
      error: (err) => {
        console.error(err);
        this.removeVacinaError()
      }
    });
  }

  cpfDigitado: string = '';
  vacinasListagem: any[] = [];
  vacinaSelecionada: any = null;

  get vacinasFiltradas(): any[] {
    return this.vacinasListagem.filter(v => {
      return this.value
        ? v.validacao === 'REALIZADA'
        : v.validacao === 'PENDENTE';
    });
  }
  
  ngOnInit(): void {
    const cpfTransferido = this.dataTransfer.getCpf();
    if (cpfTransferido) {
      this.paciente.cpf = cpfTransferido;
      this.buscarDadosPaciente();
      this.dataTransfer.limparCpf();
    }
  }

  confirmValidarVacina (vacina: any) {
    this.validarVacina = !this.validarVacina;
    this.vacinaSelecionada = vacina;
  }

  confirmRemoverVacina (vacina: any) {
    this.removerValidacaoVacina = !this.removerValidacaoVacina;
    this.vacinaSelecionada = vacina;
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
      email: '',
      imagem_perfil: ''
    };
    this.vacinasListagem = [];
  }

  alternarEdicao() {
    this.podeEditar = !this.podeEditar;
    if (this.podeEditar) {
      this.cpfOriginal = this.paciente.cpf;
    }
  }

  salvarAlteracoes() {
    const nome = this.paciente.nome_completo?.trim();
    const telefone = this.paciente.telefone?.trim();

    if (!nome) {
      this.messageService.add({ severity: 'warn', summary: 'Nome inválido!', detail: 'O nome não pode estar em branco.' });
      return;
    }

    const telefoneRegex = /^\(\d{2}\) 9\d{4}-\d{4}$/;
    if (!telefoneRegex.test(telefone)) {
      this.messageService.add({ severity: 'warn', summary: 'Número inválido!', detail: 'O telefone deve estar no formato correto com o número 9 após o DDD.' });
      return;
    }
    
    const dadosAtualizados = {
      cpf_original: this.cpfOriginal,
      cpf_novo: this.paciente.cpf,
      nome_completo: nome,
      data_nascimento: this.formatarDataParaISO(this.paciente.data_nascimento),
      telefone: telefone,
      email: this.paciente.email
    };

    // console.log('Enviando para o backend:', dadosAtualizados);

    this.enfermeiroService.atualizarDadosPaciente(dadosAtualizados).subscribe({
      next: (res) => {
        // console.log('Resposta do backend:', res);
        this.showSuccess()
        this.podeEditar = false;
      },
      error: (err) => {
        console.error('Erro ao atualizar dados:', err);
        this.showError()
      }
    });
  }

}