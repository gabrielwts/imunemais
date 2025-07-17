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
  nome: string = "";
  cpf: string = "";
  data_nascimento: string = "";
  telefone: string = "";
  email: string = "";
// 
  constructor(private router: Router) {}

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

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
