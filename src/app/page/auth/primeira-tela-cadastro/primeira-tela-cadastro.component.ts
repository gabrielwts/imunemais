import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-primeira-tela-cadastro',
  imports: [InputMaskModule, PasswordModule, ButtonModule, DatePickerModule, InputTextModule],
  templateUrl: './primeira-tela-cadastro.component.html',
  styleUrl: './primeira-tela-cadastro.component.scss'
})
export class PrimeiraTelaCadastroComponent {

}
