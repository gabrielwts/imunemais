import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { Route, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-card',
  imports: [ DatePipe, ButtonModule, AvatarModule, AvatarGroupModule, RouterModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent implements OnInit {
  paciente: any = {};
  nome: string = "";
  cpf: string = "";
  data_nascimento: string = "";
  telefone: string = "";
  email: string = "";
  foto_perfil: string = "";
// 
  constructor(private router: Router) {}

  getImagemPerfilUrl(): string {
    const baseUrl = 'http://localhost:8000';
    if (this.foto_perfil?.startsWith('/static')) {
      return baseUrl + this.foto_perfil;
    }
    return '/standard-user.jpg';
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
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
