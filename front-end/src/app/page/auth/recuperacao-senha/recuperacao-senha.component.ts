import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-recuperacao-senha',
  imports: [RouterLink, FormsModule, CommonModule, InputMaskModule, PasswordModule, ButtonModule],
  templateUrl: './recuperacao-senha.component.html',
  styleUrl: './recuperacao-senha.component.scss'
})
export class RecuperacaoSenhaComponent {
  opcaoSelecionada: string = '';
}
