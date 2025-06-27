import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';


interface RecuperarSenhaResponse {
  email: string;
  telefone: string;
}

@Component({
  selector: 'app-recuperacao-senha',
  imports: [ RouterLink, FormsModule, CommonModule, InputMaskModule, PasswordModule, ButtonModule],
  templateUrl: './recuperacao-senha.component.html',
  styleUrl: './recuperacao-senha.component.scss'
})
export class RecuperacaoSenhaComponent implements OnInit {
  telefone!: string;
  email!: string;

  ngOnInit(): void {
    const state = history.state as { telefone: string, email: string };
    this.telefone = state.telefone;
    this.email = state.email;

    console.log('ID recebido via history.state:', this.telefone + '' + this.email);
  }

  // cpf: string = '';
  // emailMascarado: string = '';
  // telefoneMascarado: string = '';
  opcaoSelecionada: string = 'email'; // valor padrão
  // dadosCarregados: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  // buscarOpcoes() {
  //   this.http.post<RecuperarSenhaResponse>(
  //     'http://127.0.0.1:8000/v1/usuarios/recuperarsenha',
  //     { cpf: this.cpf }
  //   ).subscribe({
  //     next: (res) => {
  //       console.log('Resposta recebida:', res);
  //       this.emailMascarado = res.email;
  //       this.telefoneMascarado = res.telefone;
  //       this.dadosCarregados = true;
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       console.error('Erro ao recuperar dados:', err);
  //       this.dadosCarregados = false;
  //     }
  //   });
  // }

  // enviar() {
  //   this.router.navigate(['/escolher-metodo'], {
  //     state: {
  //       telefone: this.telefoneMascarado,
  //       email: this.emailMascarado,
  //       opcaoSelecionada: this.opcaoSelecionada
  //     }
  //   });
  // }
}
