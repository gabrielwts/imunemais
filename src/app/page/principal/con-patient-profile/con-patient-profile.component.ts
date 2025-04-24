import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VacinasComponent } from "./vacinas/vacinas.component";
import { PerfilComponent } from './perfil/perfil.component';
import 'primeicons/primeicons.css';


@Component({
  selector: 'app-con-patient-profile',
  imports: [RouterModule, VacinasComponent, PerfilComponent],
  templateUrl: './con-patient-profile.component.html',
  styleUrl: './con-patient-profile.component.scss'
})
export class ConPatientProfileComponent {
  perfilDados: boolean = true;
  mostrarPerfil () {
    this.perfilDados = true;
    this.vacinasLista = false;
  }
  vacinasLista: boolean = false;
  mostrarVacinas() {
    this.vacinasLista = true;
    this.perfilDados = false;
  }
}
