import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { AlterarDadosPaciente } from '../../../../models/alterar-dados-paciente';
// import { Router } from 'express';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../services/usuario.service';

@Component({
  selector: 'app-perfil',
  imports: [ButtonModule, InputMaskModule, InputTextModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  form!: AlterarDadosPaciente;
  alterarInfo: boolean = true;

  numeroTelefone: string = "";

  mostrarInputs() {
    this.alterarInfo = !this.alterarInfo;
  }

  salvarAlteracao() {
    this.alterarInfo = !this.alterarInfo;
  }

  // Alterar dados
  constructor(private usuarioService: UsuarioService, private router: Router){
    this.form = new AlterarDadosPaciente();
  }


  alterarDados(){
    this.usuarioService.AtualizarDados(this.form).subscribe({
      next: usuarioResponse => {
        alert("Usuário cadastrado com sucesso")
      },
      error: erro => {
        alert("Não foi possível cadastrar")
        console.error("Ocorreu um erro ao tentar cadastrar: " + erro)
      }
  })
  }

  //   usuarioLogado: AlterarDadosPaciente = { email: '', telefone: '' };
  // form: AlterarDadosPaciente = { email: '', telefone: '' };

  // ngOnInit() {
  //   const token = localStorage.getItem('token');
  //   this.http.get<AlterarDadosPaciente>(`${environment.apiUrl}/v1/usuarios/me`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   }).subscribe(dados => {
  //     this.usuarioLogado = dados;
  //     this.form = { ...dados }; // inicializa o formulário
  //   });
  // }

}
