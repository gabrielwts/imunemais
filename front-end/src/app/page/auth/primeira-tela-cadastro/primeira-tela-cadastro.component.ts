import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { UsuarioCadastro } from '../../../models/usuario-cadastro';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { error } from 'console';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-primeira-tela-cadastro',
  imports: [InputMaskModule, InputTextModule, PasswordModule, ButtonModule, DatePickerModule, InputTextModule, FormsModule],
  templateUrl: './primeira-tela-cadastro.component.html',
  styleUrl: './primeira-tela-cadastro.component.scss'
})
export class PrimeiraTelaCadastroComponent {
  form: UsuarioCadastro;

  constructor(private usuarioService: UsuarioService, private router: Router){
    this.form = new UsuarioCadastro();
  }

  salvar(){
    this.usuarioService.cadastrar(this.form).subscribe({
      next: usuarioResponse => {
        alert("Usuário cadastrado com sucesso")
        this.router.navigate(["/cadastro/senha"], {state: { id: usuarioResponse.id }})
      },
      error: erro => {
        alert("Não foi possível cadastrar")
        console.error("Ocorreu um erro ao tentar cadastrar: " + erro)
      }
  })
  }
}
