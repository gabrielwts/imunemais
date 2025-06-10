import { Component } from '@angular/core';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EfetuarLogin } from '../../../models/efetuar-login';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { error } from 'console';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [InputMaskModule, PasswordModule, ButtonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: EfetuarLogin;

  constructor(private usuarioService: UsuarioService, private router: Router){
    this.form = new EfetuarLogin();
  }

  logar(){
    this.usuarioService.AutenticacaoUsuario(this.form).subscribe({
      next: usuarioResponse => {
        alert("Usuário logado")
        this.router.navigate(["/logado"])
      },
      error: erro => {
        alert("Não foi possível realizar o login!")
        console.error("Ocorreu um erro ao tentar logar: " + erro)
      }
  })
  }
}
