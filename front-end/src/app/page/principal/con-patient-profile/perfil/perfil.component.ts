import { Component, OnInit } from '@angular/core';
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
export class PerfilComponent implements OnInit {
  nome: string = "";
  cpf: string = "";
  data_nascimento: string = "";
  telefone: string = "";
  email: string = "";
  
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

  ngOnInit() {
  
    const usuarioData: string | null = localStorage.getItem('usuario');

    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      this.nome = usuario.nome || 'Visitante';
      this.cpf = usuario.cpf
      this.data_nascimento = usuario.data_nascimento
      this.telefone = usuario.telefone
      this.email = usuario.email
    } else {
      console.warn("Usuário não encontrado no localStorage.");
      this.nome = 'Visitante';
    }
  }

}
