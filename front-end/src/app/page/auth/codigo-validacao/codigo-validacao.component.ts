import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { InputOtp } from 'primeng/inputotp';

@Component({
  selector: 'app-codigo-validacao',
  imports: [ButtonModule, InputOtpModule, FormsModule],
  templateUrl: './codigo-validacao.component.html',
  styleUrl: './codigo-validacao.component.scss'
})
export class CodigoValidacaoComponent {
  verification_code: string = '';
  
}
