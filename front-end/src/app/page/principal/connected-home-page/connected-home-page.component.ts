import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connected-home-page',
  standalone: true,
  imports: [ButtonModule, AvatarModule, AvatarGroupModule, ProfileCardComponent, FormsModule, CommonModule],
  templateUrl: './connected-home-page.component.html',
  styleUrl: './connected-home-page.component.scss'
})
export class ConnectedHomePageComponent implements OnInit {
  vacinasPendentes: any[] = [];
  dadosUsuario: boolean = false;
  mostrarCard () {
    this.dadosUsuario = !this.dadosUsuario;
  }

  constructor(private vacinaService: UsuarioService){}

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
      const usuario = localStorage.getItem('usuario');
      const cpf = usuario ? JSON.parse(usuario).cpf : null;

    if (cpf) {
      this.vacinaService.getVacinasPorCpf(cpf).subscribe(res => {
        this.vacinasPendentes = res.filter(v => v.validacao === 'PENDENTE').slice(0, 3);
      });
    }

  }
}
