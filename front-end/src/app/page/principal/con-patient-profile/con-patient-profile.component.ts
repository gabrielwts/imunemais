import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil/perfil.component';
import 'primeicons/primeicons.css';
import { SelectButtonModule } from 'primeng/selectbutton';
import { VacinasComponent } from './vacinas/vacinas.component';


@Component({
  selector: 'app-con-patient-profile',
  imports: [RouterModule, VacinasComponent, PerfilComponent, SelectButtonModule],
  templateUrl: './con-patient-profile.component.html',
  styleUrl: './con-patient-profile.component.scss'
})
export class ConPatientProfileComponent implements OnInit {
  nome: string = "";
  cpf: string = "";
  data_nascimento: string = "";
  telefone: string = "";
  email: string = "";

  perfilDados: boolean = true;
  mostrarPerfil () {
    this.perfilDados = true;
    this.vacinasLista = false;
    console.log("Fechou vacinas, acessou perfil")
  }
  vacinasLista: boolean = false;
  mostrarVacinas() {
    this.vacinasLista = true;
    this.perfilDados = false;
    console.log("Fechou perfil, acessou vacinas"); 
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
