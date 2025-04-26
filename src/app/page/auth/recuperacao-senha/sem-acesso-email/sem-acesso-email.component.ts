import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-sem-acesso-email',
  imports: [RouterLink, FormsModule, CommonModule, InputMaskModule, PasswordModule, ButtonModule, InputTextModule],
  templateUrl: './sem-acesso-email.component.html',
  styleUrl: './sem-acesso-email.component.scss'
})
export class SemAcessoEmailComponent {

}
