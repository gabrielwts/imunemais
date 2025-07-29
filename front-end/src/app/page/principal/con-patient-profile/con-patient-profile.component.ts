import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  paciente: any = {};
  nome: string = "";
  cpf: string = "";
  data_nascimento: string = "";
  telefone: string = "";
  email: string = "";
  foto_perfil: string = "";

  constructor(private router: Router, private route: ActivatedRoute) {}

  getImagemPerfilUrl(): string {
    const baseUrl = 'http://localhost:8000';
    if (this.foto_perfil?.startsWith('/static')) {
      return baseUrl + this.foto_perfil;
    }
    return '/standard-user.jpg';
  }

  perfilDados: boolean = true;
  mostrarPerfil () {
    this.perfilDados = true;
    this.vacinasLista = false;
  }
  vacinasLista: boolean = false;
  mostrarVacinas() {
    this.vacinasLista = true;
    this.perfilDados = false;
  }

  ngOnInit() {
  
    const usuarioData: string | null = localStorage.getItem('paciente');

    if (usuarioData) {
      const paciente = JSON.parse(usuarioData);
      this.nome = paciente.nome || 'Visitante';
      this.cpf = paciente.cpf
      this.data_nascimento = paciente.data_nascimento
      this.telefone = paciente.telefone
      this.email = paciente.email
      this.foto_perfil = paciente.imagem_perfil
    } else {
      console.warn("Usuário não encontrado no localStorage.");
      this.nome = 'Visitante';
    }

    const state = history.state as { mostrarVacinas?: boolean };

    if (state?.mostrarVacinas) {
      this.mostrarVacinas();
    } else {
      this.mostrarPerfil();
    }
  }
}
