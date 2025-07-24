import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connected-home-page',
  standalone: true,
  imports: [ RouterModule, ButtonModule, AvatarModule, AvatarGroupModule, ProfileCardComponent, FormsModule, CommonModule],
  templateUrl: './connected-home-page.component.html',
  styleUrl: './connected-home-page.component.scss'
})
export class ConnectedHomePageComponent implements OnInit {
  vacinasPendentes: any[] = [];
  usuario: any = {};
  dadosUsuario: boolean = false;
  foto_perfil: string = "";
  mostrarCard () {
    this.dadosUsuario = !this.dadosUsuario;
  }

  constructor(private vacinaService: UsuarioService, private router: Router){}

  getImagemPerfilUrl(): string {
    const baseUrl = 'http://localhost:8000';
    if (this.foto_perfil?.startsWith('/static')) {
      return baseUrl + this.foto_perfil;
    }
    return '/standard-user.jpg';
  }

  nome: string = '';

  irParaVacinas() {
    this.router.navigateByUrl('/profile', { state: { mostrarVacinas: true } });
  }

  ngOnInit() {
    const usuarioData: string | null = localStorage.getItem('usuario');

    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      this.nome = usuario.nome || 'Visitante';
      this.foto_perfil = usuario.imagem_perfil
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
