import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-nova-senha-recuperacao',
  imports: [InputMaskModule, PasswordModule, ButtonModule],
  templateUrl: './nova-senha-recuperacao.component.html',
  styleUrl: './nova-senha-recuperacao.component.scss'
})
export class NovaSenhaRecuperacaoComponent {

}
