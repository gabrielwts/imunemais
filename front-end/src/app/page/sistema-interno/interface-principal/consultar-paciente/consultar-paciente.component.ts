import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-consultar-paciente',
  imports: [CommonModule, ButtonModule, SelectButtonModule, FormsModule, InputMaskModule, InputTextModule],
  templateUrl: './consultar-paciente.component.html',
  styleUrl: './consultar-paciente.component.scss'
})

export class ConsultarPacienteComponent {
  podeEditar: boolean = false;
  validarVacina: boolean = false;
  removerValidacaoVacina: boolean = false;

  cpfDigitado: string = '';
  paciente: any = null;
  vacinas: any[] = [];

  confirmValidarVacina () {
    this.validarVacina = !this.validarVacina;
  }

  confirmRemoverVacina () {
    this.removerValidacaoVacina = !this.removerValidacaoVacina;
  }

  // validarVacina(vacina: any, realizar: boolean) {
  //   this.http.put(`http://localhost:8000/enfermeiros/vacina/${vacina.id}/validar`, { realizada: realizar })
  //     .subscribe({
  //       next: () => {
  //         vacina.status = realizar ? 'REALIZADA' : 'PENDENTE';
  //       },
  //       error: () => alert('Erro ao atualizar o status da vacina')
  //     });
  // }

  alternarEdicao() {
    this.podeEditar = !this.podeEditar;
  }

  stateOptions = [
    { label: 'Histórico', value: true },
    { label: 'Pendentes', value: false }
  ];

  value: boolean = true;

  // Função para buscar dados conforme a opção selecionada
  // buscarDados() {
  //   if (!this.paciente) return;

  //   const cpf = this.paciente.cpf.replace(/\D/g, '');

  //   const statusFiltro = this.value ? 'REALIZADA' : 'PENDENTE';

  //   this.http.get<any[]>(`http://localhost:8000/enfermeiros/paciente/${cpf}/vacinas?status=${statusFiltro}`)
  //     .subscribe(res => this.vacinas = res);
  // }

  // constructor(private http: HttpClient) {}

  // buscarPacientePorCpf() {
  //   if (!this.cpfDigitado || this.cpfDigitado.trim() === '') {
  //     alert('Por favor, digite um CPF válido');
  //     return;
  //   }

  //   this.paciente = null;
  //   this.vacinas = [];

  //   const cpfSemMascara = this.cpfDigitado.replace(/\D/g, '');

  //   this.http.get(`http://localhost:8000/enfermeiros/paciente/${cpfSemMascara}`).subscribe({
  //     next: (res: any) => {
  //       this.paciente = res;
  //       this.buscarDados();
  //     },
  //     error: () => {
  //       alert('Paciente não encontrado no banco de dados.');
  //       this.paciente = null;
  //       this.vacinas = [];
  //     }
  //   });
  // }
}