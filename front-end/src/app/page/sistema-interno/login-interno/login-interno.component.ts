import { Component } from '@angular/core';
import { AdmEfetuarLogin } from '../../../models/adm_models/adm-efetuar-login';
import { EnfermeirosService } from '../../../services/enfermeiros.service';
import { Route, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-interno',
  imports: [InputMaskModule, PasswordModule, ButtonModule, FormsModule, ToastModule, RippleModule],
  templateUrl: './login-interno.component.html',
  styleUrl: './login-interno.component.scss',
  providers: [MessageService]
})
export class LoginInternoComponent {
  form: AdmEfetuarLogin;

  constructor(private usuarioService: EnfermeirosService, private messageService: MessageService, private router: Router){
    this.form = new AdmEfetuarLogin();
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Login efetuado!', detail: 'Usuário logado com sucesso.' });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Não foi possível realizar o login!', detail: 'Usuário ou senha inválidos.' });
  }

  logar(){
    this.usuarioService.AutenticacaoUsuario(this.form).subscribe({
      next: res => {
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('usuario', JSON.stringify(res.usuario));

      this.showSuccess()

      setTimeout(() => {
        this.router.navigate(["/sistema-interno-professionals"]);
      }, 1200);
    },
    error: erro => {
      this.showError()
    }
  });
  }

}
