import { Component } from '@angular/core';
import { AdmEfetuarLogin } from '../../../models/adm_models/adm-efetuar-login';
import { EnfermeirosService } from '../../../services/enfermeiros.service';
import { Route, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login-interno',
  imports: [InputMaskModule, PasswordModule, ButtonModule, FormsModule],
  templateUrl: './login-interno.component.html',
  styleUrl: './login-interno.component.scss'
})
export class LoginInternoComponent {
  form: AdmEfetuarLogin;

  constructor(private usuarioService: EnfermeirosService, private router: Router){
    this.form = new AdmEfetuarLogin();
  }

  logar(){
    this.usuarioService.AutenticacaoUsuario(this.form).subscribe({
      next: res => {
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('usuario', JSON.stringify(res.usuario));

      alert("Usuário logado com sucesso!");
      
      this.router.navigate(["/sistema-interno-professionals"]);
    },
    error: erro => {
      alert("Não foi possível realizar o login!");
      console.error("Erro ao tentar logar: ", erro);
    }
  });
  }

}
