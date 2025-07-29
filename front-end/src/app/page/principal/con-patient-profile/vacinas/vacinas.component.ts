import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { UsuarioService } from '../../../../services/usuario.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  standalone: true,
  selector: 'app-vacinas',
  imports: [ DialogModule, ButtonModule, SelectButtonModule, FormsModule, CommonModule],
  templateUrl: './vacinas.component.html',
  styleUrl: './vacinas.component.scss'
})

export class VacinasComponent implements OnInit {
  stateOptions = [
    { label: 'Histórico', value: true },
    { label: 'Pendentes', value: false }
  ];

  value: boolean = true; // true = REALIZADA, false = PENDENTE

  vacinas: any[] = [];

  constructor(private vacinaService: UsuarioService){}

  ngOnInit() {
    this.buscarVacinas();
  }

  buscarVacinas() {
    const paciente = localStorage.getItem('paciente');
    const cpf = paciente ? JSON.parse(paciente).cpf : null;

    // console.log('CPF usado na requisição:', cpf);
    if (cpf) {
      this.vacinaService.getVacinasPorCpf(cpf).subscribe((res) => {
        this.vacinas = res;
        // console.log('Vacinas recebidas:', this.vacinas);
        localStorage.setItem('vacinas', JSON.stringify(res));
      });
    }
  }

  get vacinasFiltradas(): any[] {
    return this.vacinas.filter(v => 
      this.value ? v.validacao === 'REALIZADA' : v.validacao === 'PENDENTE'
    );
  }

  onFiltroChange() {
    // console.log('Filtro alterado para:', this.value);
  }

}
