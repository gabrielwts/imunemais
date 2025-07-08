import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

interface userType {
  name: string;
}

@Component({
  selector: 'app-alterar-dados-profissional',
  imports: [InputTextModule, FormsModule, FloatLabelModule, ButtonModule, SelectModule],
  templateUrl: './alterar-dados-profissional.component.html',
  styleUrl: './alterar-dados-profissional.component.scss'
})
export class AlterarDadosProfissionalComponent {
  userTypes: userType[] = [];         // Lista de opções
  selecteduserType: userType | null = null; // Item selecionado

  ngOnInit() {
    this.userTypes = [
      { name: 'Administrador' },
      { name: 'Profissional' },
    ];
  }

}