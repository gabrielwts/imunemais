import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-cadastrar-profissional',
  imports: [InputTextModule, FormsModule, ButtonModule],
  templateUrl: './cadastrar-profissional.component.html',
  styleUrl: './cadastrar-profissional.component.scss'
})
export class CadastrarProfissionalComponent {

}
