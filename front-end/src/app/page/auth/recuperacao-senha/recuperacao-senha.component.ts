import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { MessageService } from 'primeng/api';
import { RecuperarSenhaEmail } from '../../../models/recuperar-senha-email';

interface RecuperarSenhaResponse {
  email: string;
  telefone: string;
}

@Component({
  selector: 'app-recuperacao-senha',
  standalone: true,
  imports: [ RouterLink, FormsModule, CommonModule, InputMaskModule, PasswordModule, ButtonModule],
  templateUrl: './recuperacao-senha.component.html',
  styleUrl: './recuperacao-senha.component.scss',
  providers: [MessageService]
})
export class RecuperacaoSenhaComponent implements OnInit {
  telefone!: string;
  email!: string;
  cpf!: string;
  email_real!: string;
  form!: RecuperarSenhaEmail;
  opcaoSelecionada: string = 'email';
  botaoDesativado: boolean = false;

  constructor(private http: HttpClient, private usuarioService: UsuarioService, private messageService: MessageService, private router: Router) {
    this.form = new RecuperarSenhaEmail();
  }

  ngOnInit(): void {
    const state = history.state as { telefone: string, email: string, cpf: string, email_real: string };
    this.telefone = state.telefone;
    this.email = state.email;
    this.cpf = state.cpf;
    this.email_real = state.email_real;

    localStorage.removeItem('codigo_recuperacao');
  }

  proximo() {
    if (this.botaoDesativado) return; // Evita spam de clique
    this.botaoDesativado = true;

    if (this.opcaoSelecionada === 'email') {
      this.form.email = this.email_real;
      this.form.cpf = this.cpf;
      this.enviarEmail();
    } else if (this.opcaoSelecionada === 'telefone') {
      // this.enviarCodigoTelefone();
    }

    setTimeout(() => {
      this.botaoDesativado = false;
    }, 5000);
  }

  enviarEmail () {
    // this.form.email = this.email;
    // this.form.cpf = localStorage.getItem('cpf') || '';

    this.usuarioService.RecuperarSenhaEmail(this.form).subscribe({
      next: res => {
        console.log('Resposta backend:', res);

        if (res.codigo) {
          localStorage.setItem('codigo_recuperacao', res.codigo);
          localStorage.setItem('cpf', this.cpf)
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
