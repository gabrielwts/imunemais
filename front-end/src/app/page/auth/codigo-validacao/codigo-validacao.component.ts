import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { InputOtp } from 'primeng/inputotp';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { error } from 'console';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-codigo-validacao',
  imports: [RouterLink, ButtonModule, InputOtpModule, FormsModule, ToastModule, RippleModule],
  templateUrl: './codigo-validacao.component.html',
  styleUrl: './codigo-validacao.component.scss',
  providers: [MessageService]
})
export class CodigoValidacaoComponent implements OnInit {
  verification_code: string = '';
  codigoSalvo: string | null = null;
  cpfSalvo: string | null = null;

  constructor(private messageService: MessageService, private router: Router) {}

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Código validado com sucesso!', detail: '' });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Código inválido!', detail: 'Código incorreto ou expirado, tente novamente.' });
  }

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Erro ao atualizar dados!', detail: 'Número inválido, corrija o número de telefone.', life: 3000 });
  }

  ngOnInit(): void {
    this.codigoSalvo = localStorage.getItem('codigo_recuperacao');
    this.cpfSalvo = localStorage.getItem('cpf');

    if (!this.codigoSalvo) {
      this.router.navigate(['/recuperar-senha']);
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('codigo_recuperacao');
    const rotaAtual = this.router.url;
    if (rotaAtual !== '/nova-senha') {
      localStorage.removeItem('cpf');
    }
  }

  validarCodigo(): void {
    if (this.verification_code === this.codigoSalvo) {
      this.showSuccess()

      if (this.cpfSalvo) {
        localStorage.setItem('cpf', this.cpfSalvo);
      }

      setTimeout(() => {
        this.router.navigate(['/nova-senha']);
      }, 1400);
    } 
    else {
      this.showError()
    }
  }

}
