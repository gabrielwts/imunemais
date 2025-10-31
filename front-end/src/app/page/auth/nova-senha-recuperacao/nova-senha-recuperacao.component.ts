import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { SenhaCadastro } from '../../../models/senha-cadastro';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { RecuperarSenhaCadastro } from '../../../models/recuperar-senha-cadastro';

@Component({
  selector: 'app-nova-senha-recuperacao',
  imports: [InputMaskModule, PasswordModule, ButtonModule, FormsModule, ToastModule, RippleModule],
  templateUrl: './nova-senha-recuperacao.component.html',
  styleUrl: './nova-senha-recuperacao.component.scss',
  providers: [MessageService]
})
export class NovaSenhaRecuperacaoComponent implements OnInit {
  cpfSalvo: string | null = null;
  form: RecuperarSenhaCadastro;
  confirmarSenha: string = '';

  constructor(private usuarioService: UsuarioService, private messageService: MessageService, private router: Router) {
    this.form = new RecuperarSenhaCadastro();
  }

  ngOnInit(): void {
    this.cpfSalvo = localStorage.getItem('cpf');
  }

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Erro ao cadastrar a senha!', detail: 'As senhas não coincidem. Por favor, verifique.', life: 3000 });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Senha alterada!', detail: 'Alteração de senha realizada com sucesso.', life: 3000 });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Erro ao cadastrar a senha!', detail: 'Senha inválida ou não coincidem, verifique antes de enviar.', life: 3250 });
  }

  cadastrarSenha() {
    if (!this.cpfSalvo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sessão expirada!',
        detail: 'Por favor, volte e refaça o processo de recuperação.',
        life: 3000
      });
      this.router.navigate(['/recuperar-senha']);
      return;
    }

    if (this.form.senha !== this.confirmarSenha) {
      this.showWarn()
      return;
    }

    // console.log("Enviando:", {
    //   cpf: this.cpfSalvo,
    //   form: this.form
    // });

    const body = {
      senha: this.form.senha
    };

    this.usuarioService.RecuperarCadastroNovaSenha(this.cpfSalvo, body).subscribe({
      next: () => {
        this.showSuccess()
        localStorage.removeItem('cpf');
        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 1400);
      },
      error: (erro) => {
        this.showError()
      }
    });
  }

}
