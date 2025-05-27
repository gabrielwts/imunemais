import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VacinasComponent } from "./vacinas/vacinas.component";
import { PerfilComponent } from './perfil/perfil.component';
import 'primeicons/primeicons.css';
import { SelectButtonModule } from 'primeng/selectbutton';


@Component({
  selector: 'app-con-patient-profile',
  imports: [RouterModule, VacinasComponent, PerfilComponent, SelectButtonModule],
  templateUrl: './con-patient-profile.component.html',
  styleUrl: './con-patient-profile.component.scss'
})
export class ConPatientProfileComponent {
  perfilDados: boolean = true;
  mostrarPerfil () {
    this.perfilDados = true;
    this.vacinasLista = false;
    console.log("Fechou vacinas, acessou perfil")
  }
  vacinasLista: boolean = false;
  mostrarVacinas() {
    this.vacinasLista = true;
    this.perfilDados = false;
    console.log("Fechou perfil, acessou vacinas"); 
  }
}
