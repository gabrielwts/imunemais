import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { UsuarioService } from '../../../../services/usuario.service';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RecuperarSenhaEmail } from '../../../../models/recuperar-senha-email';
import { RecuperarEmailSenhaCadastro } from '../../../../models/recuperar-email-senha-cadastro';


@Component({
  selector: 'app-sem-acesso-email',
  imports: [RouterLink, FormsModule, CommonModule, InputMaskModule, PasswordModule, ButtonModule, InputTextModule],
  templateUrl: './sem-acesso-email.component.html',
  styleUrl: './sem-acesso-email.component.scss',
  providers: [MessageService]
})
export class SemAcessoEmailComponent implements OnInit {
  novo_email!: string;
  email!: string;
  cpf!: string;
  botaoDesativado: boolean = false;
  form!: RecuperarEmailSenhaCadastro;

  constructor(private http: HttpClient, private usuarioService: UsuarioService, private messageService: MessageService, private router: Router) {
    this.form = new RecuperarEmailSenhaCadastro();
  }

  ngOnInit(): void {
    const state = history.state as { email?: string };

    // if (!state || !state.cpf) {
    //   this.router.navigate(['/esqueceu-senha']);
    //   return;
    // }

    this.email = state.email!;
  }

  proximo() {
    if (this.botaoDesativado) return;
    this.botaoDesativado = true;

    this.form.email = this.novo_email;

    // console.log("Enviando body:", this.form);
    this.enviarEmail();
    

    setTimeout(() => {
      this.botaoDesativado = false;
    }, 5000);
  }

  enviarEmail () {

    this.usuarioService.RecuperarSenhaNovoEmail(this.form).subscribe({
      next: res => {

        if (res.codigo) {
          localStorage.setItem('codigo_recuperacao', res.codigo);

        }

        this.router.navigate(['/codigo-validacao']);

        // this.showSuccess()
      },
      error: erro => {
        // this.showError()
      }
    });
  }

}
