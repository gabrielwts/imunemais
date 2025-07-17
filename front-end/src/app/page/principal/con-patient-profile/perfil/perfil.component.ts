import { Component, HostListener, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { AlterarDadosPaciente } from '../../../../models/alterar-dados-paciente';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../services/usuario.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-perfil',
  imports: [ DatePipe ,ButtonModule, InputMaskModule, InputTextModule, CommonModule, FormsModule, ToastModule, RippleModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
  providers: [MessageService]

})
export class PerfilComponent implements OnInit {
  nome: string = "";
  cpf: string = "";
  data_nascimento: string = "";
  telefone: string = "";
  email: string = "";
  telefoneInvalido = false;
  
  form!: AlterarDadosPaciente;
  alterarInfo: boolean = true;

  numeroTelefone: string = "";

  validarTelefone() {
    const tel = this.form.telefone;

    if (!tel || tel.length < 14) {
      this.telefoneInvalido = true;
      return;
    }

    const apenasNumeros = tel.replace(/\D/g, '');

    this.telefoneInvalido = apenasNumeros[2] !== '9';
  }

  mostrarInputs() {
    this.alterarInfo = !this.alterarInfo;
  }

  salvarAlteracao() {
    this.alterarDados();
    this.alterarInfo = true; 
  }

  constructor(private usuarioService: UsuarioService, private messageService: MessageService, private router: Router){
    this.form = new AlterarDadosPaciente();
  }

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Erro ao atualizar dados!', detail: 'Número inválido, corrija o número de telefone.', life: 3000 });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Não foi possível atualizar os dados!', detail: 'Número ou e-mail inválido, verifique antes de enviar.', life: 3250 });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Alterações realizadas!', detail: 'Dados atualizados com sucesso.', life: 3000 });
  }

  alterarDados() {
    const dados: any = {
      cpf: this.cpf
    };

    let telefoneSendoEditado = false;

    if (this.form.telefone && this.form.telefone.trim() !== "") {
      this.validarTelefone(); 
      telefoneSendoEditado = true;

      if (this.telefoneInvalido) {
        this.showWarn()
        this.form = new AlterarDadosPaciente();
        return;
      }

      dados.telefone = this.form.telefone;
    }

    if (this.form.email && this.form.email.trim() !== "") {
      dados.email = this.form.email;
      this.form = new AlterarDadosPaciente();
    }

    if (!dados.telefone && !dados.email) {
      return;
    }

    this.usuarioService.AtualizarDados(dados).subscribe({
      next: response => {
        this.showSuccess()

        this.form.telefone = response.telefone || this.form.telefone;
        this.form.email = response.email || this.form.email;

        this.telefone = this.form.telefone ?? '';
        this.email = this.form.email ?? '';

        const dadosOriginais = JSON.parse(localStorage.getItem('usuario') || '{}');
        const novosDados = {
          ...dadosOriginais,
          telefone: response.telefone ?? dadosOriginais.telefone,
          email: response.email ?? dadosOriginais.email
        };
        localStorage.setItem('usuario', JSON.stringify(novosDados));
        // console.log("LocalStorage atualizado com os novos dados.");
      },
      error: erro => {
        this.showError()
        this.form = new AlterarDadosPaciente();
      }
    });
  }

  ngOnInit() {
  
    const usuarioData: string | null = localStorage.getItem('usuario');

    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      this.nome = usuario.nome || 'Visitante';
      this.cpf = usuario.cpf
      this.data_nascimento = usuario.data_nascimento
      this.telefone = usuario.telefone
      this.email = usuario.email
    } else {
      console.warn("Usuário não encontrado no localStorage.");
      this.nome = 'Visitante';
    }
  }

}