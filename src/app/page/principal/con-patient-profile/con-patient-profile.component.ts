import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VacinasComponent } from "./vacinas/vacinas.component";

@Component({
  selector: 'app-con-patient-profile',
  imports: [RouterModule, VacinasComponent],
  templateUrl: './con-patient-profile.component.html',
  styleUrl: './con-patient-profile.component.scss'
})
export class ConPatientProfileComponent {
  vacinasLista: boolean = false;
  mostrarVacinas() {
    this.vacinasLista = true;
  }
}
