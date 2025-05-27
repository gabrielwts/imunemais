import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-segunda-tela-cadastro',
  imports: [InputMaskModule, PasswordModule, ButtonModule, FormsModule],
  templateUrl: './segunda-tela-cadastro.component.html',
  styleUrl: './segunda-tela-cadastro.component.scss'
})
export class SegundaTelaCadastroComponent {

}
