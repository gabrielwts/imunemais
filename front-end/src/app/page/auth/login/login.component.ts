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
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  imports: [InputMaskModule, PasswordModule, ButtonModule, RouterLink, FormsModule, ToastModule, RippleModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {
  form: EfetuarLogin;

  constructor(private usuarioService: UsuarioService, private messageService: MessageService, private router: Router){
    this.form = new EfetuarLogin();
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Login efetuado!', detail: 'Usuário logado com sucesso.' });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Não foi possível realizar o login!', detail: 'CPF ou senha inválidos.' });
  }

  logar(){
    this.usuarioService.AutenticacaoUsuario(this.form).subscribe({
      next: res => {
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('paciente', JSON.stringify(res.paciente));
      
      this.showSuccess()
      
      setTimeout(() => {
        this.router.navigate(["/logado"]);
      }, 1200);
    },
    error: erro => {
      this.showError()
    }
  });
  }
}