import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-perfil-alterardados',
  imports: [ButtonModule, InputMaskModule, InputTextModule],
  templateUrl: './perfil-alterardados.component.html',
  styleUrl: './perfil-alterardados.component.scss'
})
export class PerfilAlterardadosComponent {
  alterarInfo: boolean = true;
  alteracaoDeInfo () {
    this.alterarInfo = false;
    console.log("Deu boa pai"); 
  }
}