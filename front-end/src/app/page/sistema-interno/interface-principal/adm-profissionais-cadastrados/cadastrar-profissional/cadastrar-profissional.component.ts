import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown'; // se estiver usando PrimeNG, ajuste se for outro

interface UserType {
  name: string;
  code: string;
}

@Component({
  selector: 'app-cadastrar-profissional',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './cadastrar-profissional.component.html',
  styleUrls: ['./cadastrar-profissional.component.css']
})
export class CadastrarProfissionalComponent {
  userTypes: UserType[] = [
    { name: 'Administrador', code: 'admin' },
    { name: 'Enfermeiro', code: 'enfermeiro' }
  ];

  selectedUserType?: UserType;

  nome = '';
  email = '';
  senha = '';

  cadastrar() {
    if (!this.nome || !this.email || !this.senha || !this.selectedUserType) {
      alert('Preencha todos os campos!');
      return;
    }
    // Aqui a lógica de cadastro, ex: chamada API
    console.log('Cadastrando profissional:', {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      tipo: this.selectedUserType.code
    });
    alert('Profissional cadastrado com sucesso!');
    this.limparCampos();
  }

  limparCampos() {
    this.nome = '';
    this.email = '';
    this.senha = '';
    this.selectedUserType = undefined;
  }
}
