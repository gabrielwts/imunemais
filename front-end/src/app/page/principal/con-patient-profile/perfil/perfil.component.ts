import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { AlterarDadosPaciente } from '../../../../models/alterar-dados-paciente';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-perfil',
  imports: [ButtonModule, InputMaskModule, InputTextModule, CommonModule, FormsModule],
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
    this.alterarDados();
    this.alterarInfo = true; // esconde os inputs depois de salvar
  }

  // Alterar dados
  constructor(private usuarioService: UsuarioService, private router: Router){
    this.form = new AlterarDadosPaciente();
  }


  alterarDados() {
    const dados: any = {
      cpf: this.cpf
    };

    if (this.form.telefone && this.form.telefone.trim() !== "") {
      dados.telefone = this.form.telefone;
    }

    if (this.form.email && this.form.email.trim() !== "") {
      dados.email = this.form.email;
    }

    this.usuarioService.AtualizarDados(dados).subscribe({
      next: response => {
        alert("Dados atualizados com sucesso");

        if (dados.telefone) {
          this.telefone = dados.telefone;
        }

        if (dados.email) {
          this.email = dados.email;
        }
      },
      error: erro => {
        alert("Não foi possível atualizar os dados");
        console.error("Erro ao tentar atualizar:", erro.error || erro);
      }
    });
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