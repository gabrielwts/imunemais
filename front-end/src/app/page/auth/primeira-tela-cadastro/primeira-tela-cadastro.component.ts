import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { UsuarioCadastro } from '../../../models/usuario-cadastro';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { error } from 'console';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-primeira-tela-cadastro',
  imports: [ CommonModule, InputMaskModule, InputTextModule, PasswordModule, ButtonModule, DatePickerModule, InputTextModule, FormsModule, ToastModule, RippleModule],
  templateUrl: './primeira-tela-cadastro.component.html',
  styleUrl: './primeira-tela-cadastro.component.scss',
  providers: [MessageService]
})
export class PrimeiraTelaCadastroComponent {
  form: UsuarioCadastro;
  telefoneInvalido = false;

  constructor(private usuarioService: UsuarioService, private messageService: MessageService, private router: Router){
    this.form = new UsuarioCadastro();
  }
  
  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Erro ao cadastrar!', detail: 'Número inválido, corrija o número de telefone.', life: 3000 });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Erro ao cadastrar!', detail: 'Não foi possível cadastrar, verifique os dados antes de enviar.', life: 3250 });
  }

  validarTelefone() {
    const tel = this.form.telefone;

    if (!tel || tel.length < 14) {
      this.telefoneInvalido = true;
      return;
    }

    const apenasNumeros = tel.replace(/\D/g, '');

    this.telefoneInvalido = apenasNumeros[2] !== '9';
  }

  salvar(){
    this.validarTelefone(); // força validação antes do envio
    if (this.telefoneInvalido) {
      this.showWarn()
      return;
    }

    this.usuarioService.cadastrar(this.form).subscribe({
      next: usuarioResponse => {
        // alert("Usuário cadastrado com sucesso")
        this.router.navigate(["/cadastro/senha"], {state: { id: usuarioResponse.id }})
      },
      error: erro => {
        this.showError()
        // console.error("Ocorreu um erro ao tentar cadastrar: " + erro)
      }
  })
  }
}
