import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-connected-home-page',
  standalone: true,
  imports: [ButtonModule, AvatarModule, AvatarGroupModule, ProfileCardComponent, FormsModule],
  templateUrl: './connected-home-page.component.html',
  styleUrl: './connected-home-page.component.scss'
})
export class ConnectedHomePageComponent implements OnInit { // 
  dadosUsuario: boolean = false;
  mostrarCard () {
    this.dadosUsuario = !this.dadosUsuario;
  }

  nome: string = '';

  ngOnInit() {
    const usuarioData: string | null = localStorage.getItem('usuario');

    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      this.nome = usuario.nome || 'Visitante';
    } else {
      console.warn("Usuário não encontrado no localStorage.");
      this.nome = 'Visitante';
    }
  }
}
