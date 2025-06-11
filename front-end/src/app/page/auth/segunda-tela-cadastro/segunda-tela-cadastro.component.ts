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

export class FormSenhaCadastro {
    constructor(public senha: string = "", public confirmSenha: string = ""){}
}

@Component({
  selector: 'app-segunda-tela-cadastro',
  imports: [InputMaskModule, PasswordModule, ButtonModule, FormsModule],
  templateUrl: './segunda-tela-cadastro.component.html',
  styleUrl: './segunda-tela-cadastro.component.scss'
})
export class SegundaTelaCadastroComponent implements OnInit {
  id!: number;
  form: FormSenhaCadastro;

  constructor(private usuarioService: UsuarioService, private route: ActivatedRoute, private router: Router){
    this.form = new FormSenhaCadastro();
  }

  ngOnInit(): void {
    const state = history.state as { id: number };
    this.id = state.id;

    console.log('ID recebido via history.state:', this.id);
  }

  salvar(){
    const senhaCad = new SenhaCadastro(this.form.senha, this.id)

    console.log("Enviando:", this.id, senhaCad);

    this.usuarioService.cadastrarSenha(senhaCad).subscribe({
      next: (usuarioResponse) => {
        alert("Senha cadastrada com sucesso")
        this.router.navigate(["/login"])
      },
      error: erro => {
        alert("Não foi possível cadastrar")
        console.error("Ocorreu um erro ao tentar cadastrar: " + erro)
      }
  })
  }
}
