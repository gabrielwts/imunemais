import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { SenhaCadastro } from '../../../models/senha-cadastro';
import { UsuarioService } from '../../../services/usuario.service';
import { error } from 'console';
import { Route, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-segunda-tela-cadastro',
  imports: [InputMaskModule, PasswordModule, ButtonModule, FormsModule, ToastModule, RippleModule],
  templateUrl: './segunda-tela-cadastro.component.html',
  styleUrl: './segunda-tela-cadastro.component.scss',
  providers: [MessageService]
})

export class SegundaTelaCadastroComponent { 
  id!: number;
  form: SenhaCadastro;
  confirmarSenha: string = '';

  constructor(private usuarioService: UsuarioService, private messageService: MessageService, private router: Router) {
    this.form = new SenhaCadastro();

    const state = history.state as { id: number };
    this.id = state.id;

    // console.log('ID recebido via history.state:', this.id);
  }

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Erro ao cadastrar a senha!', detail: 'As senhas não coincidem. Por favor, verifique.', life: 3000 });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Usuário cadastrado!', detail: 'Cadastro realizado com sucesso.', life: 3000 });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Erro ao cadastrar a senha!', detail: 'Senha inválida ou não coincidem, verifique antes de enviar.', life: 3250 });
  }

  cadastrarSenha() {
    if (this.form.senha !== this.confirmarSenha) {
      this.showWarn()
      return;
    }

    this.usuarioService.cadastrarSenha(this.id, this.form).subscribe({
      next: () => {
        this.showSuccess()
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 1200);
      },
      error: (erro) => {
        this.showError()
      }
    });
  }
}