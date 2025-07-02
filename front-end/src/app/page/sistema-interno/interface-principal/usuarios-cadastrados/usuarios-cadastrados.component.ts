import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Usuario {
  nome: string;
  tipo: string;
}

@Component({
  selector: 'app-usuarios-cadastrados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-cadastrados.component.html',
  styleUrls: ['./usuarios-cadastrados.component.css']
})
export class UsuariosCadastradosComponent {
  usuarios: Usuario[] = [
    { nome: 'João', tipo: 'Enfermeiro' },
    { nome: 'Maria', tipo: 'Administrador' }
  ];
}
