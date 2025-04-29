import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-perfil',
  imports: [ButtonModule, InputMaskModule, InputTextModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  alterarInfo: boolean = true;

  mostrarInputs() {
    this.alterarInfo = !this.alterarInfo;
  }

  salvarAlteracao() {
    this.alterarInfo = !this.alterarInfo;
  }
}
