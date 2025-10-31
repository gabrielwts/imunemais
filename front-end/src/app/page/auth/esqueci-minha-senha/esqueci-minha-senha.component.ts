import { Component, NgModule } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { RecuperarSenhaCpf } from '../../../models/recuperar-senha-cpf';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioCadastro } from '../../../models/usuario-cadastro';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-esqueci-minha-senha',
  imports: [InputMaskModule, PasswordModule, ButtonModule, RouterLink, InputTextModule, FormsModule, ToastModule, RippleModule],
  templateUrl: './esqueci-minha-senha.component.html',
  styleUrl: './esqueci-minha-senha.component.scss',
  providers: [MessageService]
})
export class EsqueciMinhaSenhaComponent {
  form: RecuperarSenhaCpf;

  constructor(private usuarioService: UsuarioService, private messageService: MessageService, private router: Router){
    this.form = new RecuperarSenhaCpf();
  }

    showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Erro ao cadastrar a senha!', detail: 'As senhas não coincidem. Por favor, verifique.', life: 3000 });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Usuário cadastrado!', detail: 'Cadastro realizado com sucesso.', life: 3000 });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Erro ao enviar!', detail: 'CPF inválido ou não cadastrado, verifique antes de enviar.', life: 3250 });
  }

  enviar(){
    this.usuarioService.RecuperarSenhaCpf(this.form).subscribe({
      next: recuperarSenhaResponse => {
        this.router.navigate(["/recuperar-senha"], {state: {telefone: recuperarSenhaResponse.telefone, email: recuperarSenhaResponse.email, cpf: recuperarSenhaResponse.cpf, email_real: recuperarSenhaResponse.email_real }})
      },
      error: erro => {
        if (erro.status === 404) {
          this.messageService.add({
            severity: 'error',
            summary: 'CPF não encontrado',
            detail: 'Nenhum usuário com esse CPF foi localizado.',
            life: 3000
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao enviar!',
            detail: 'Ocorreu um erro. Tente novamente.',
            life: 3000
          });
        }
      }
  })
  }
}
