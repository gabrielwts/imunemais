import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-usuarios-cadastrados',
  imports: [InputTextModule, FormsModule, FloatLabelModule, ButtonModule],
  templateUrl: './usuarios-cadastrados.component.html',
  styleUrl: './usuarios-cadastrados.component.scss'
})
export class UsuariosCadastradosComponent {

}