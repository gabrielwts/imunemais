import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-esqueci-minha-senha',
  imports: [InputMaskModule, PasswordModule, ButtonModule, RouterLink],
  templateUrl: './esqueci-minha-senha.component.html',
  styleUrl: './esqueci-minha-senha.component.scss'
})
export class EsqueciMinhaSenhaComponent {

}
