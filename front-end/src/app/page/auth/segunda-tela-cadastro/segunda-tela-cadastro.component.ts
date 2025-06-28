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

@Component({
  selector: 'app-segunda-tela-cadastro',
  imports: [InputMaskModule, PasswordModule, ButtonModule, FormsModule],
  templateUrl: './segunda-tela-cadastro.component.html',
  styleUrl: './segunda-tela-cadastro.component.scss'
})

export class SegundaTelaCadastroComponent { // implements OnInit
  id!: number;
  form: SenhaCadastro;
  confirmarSenha: string = '';

  // constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router){
  //   this.form = new SenhaCadastro();
  // }

  constructor(private usuarioService: UsuarioService, private router: Router) {
    this.form = new SenhaCadastro();

    const state = history.state as { id: number };
    this.id = state.id;

    console.log('ID recebido via history.state:', this.id);
  }

  cadastrarSenha() {
    if (this.form.senha !== this.confirmarSenha) {
      alert("As senhas não coincidem. Por favor, verifique.");
      return;
    }
    // console.log('Senha:', this.form.senha);
    // console.log('Confirmação:', this.confirmarSenha);

    this.usuarioService.cadastrarSenha(this.id, this.form).subscribe({
      next: () => {
        alert("Senha cadastrada com sucesso!");
        this.router.navigate(['/login']); // ou próxima etapa
      },
      error: (erro) => {
        alert("Erro ao cadastrar senha.");
        console.error(erro);
      }
    });
  }
  // ngOnInit(): void {
  //   const state = history.state as { id: number };
  //   this.id = state.id;

  //   console.log('ID recebido via history.state:', this.id);
  // }

  // salvar(){
  //   const senhaCad = {senha: this.form.senha};

  //   console.log("Enviando:", this.id, senhaCad);

  //   this.usuarioService.cadastrarSenha(this.id, senhaCad).subscribe({
  //     next: (usuarioResponse) => {
  //       alert("Senha cadastrada com sucesso")
  //       this.router.navigate(["/login"])
  //     },
  //     error: erro => {
  //       alert("Não foi possível cadastrar")
  //       console.error("Ocorreu um erro ao tentar cadastrar: " + erro)
  //     }
  // })
  // }
}