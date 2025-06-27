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

@Component({
  selector: 'app-esqueci-minha-senha',
  imports: [InputMaskModule, PasswordModule, ButtonModule, RouterLink, InputTextModule, FormsModule],
  templateUrl: './esqueci-minha-senha.component.html',
  styleUrl: './esqueci-minha-senha.component.scss'
})
export class EsqueciMinhaSenhaComponent {
  form: RecuperarSenhaCpf;

  constructor(private usuarioService: UsuarioService, private router: Router){
    this.form = new RecuperarSenhaCpf();
  }

  enviar(){
    this.usuarioService.RecuperarSenhaCpf(this.form).subscribe({
      next: recuperarSenhaResponse => {
        // console.log('Telefone:', recuperarSenhaResponse.telefone);
        // console.log('Email:', recuperarSenhaResponse.email);
        alert("CPF encaminhado")
        this.router.navigate(["/recuperar-senha"], {state: {telefone: recuperarSenhaResponse.telefone, email: recuperarSenhaResponse.email}})
      },
      error: erro => {
        alert("Não foi possível cadastrar")
        console.error("Ocorreu um erro ao tentar cadastrar: " + erro)
      }
  })
  }
}
