import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule, Select } from 'primeng/select';

interface userType {
  name: string;
}

@Component({
  selector: 'app-cadastrar-profissional',
  imports: [InputTextModule, FormsModule, FloatLabelModule, ButtonModule, SelectModule],
  templateUrl: './cadastrar-profissional.component.html',
  styleUrl: './cadastrar-profissional.component.scss'
})
export class CadastrarProfissionalComponent {
  userTypes: userType[] = [];         // Lista de opções
  selecteduserType: userType | null = null; // Item selecionado

  ngOnInit() {
    this.userTypes = [
      { name: 'Administrador' },
      { name: 'Profissional' },
    ];
  }
}
