import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  private cpfSelecionado: string = '';

  setCpf(cpf: string) {
    this.cpfSelecionado = cpf;
  }

  getCpf(): string {
    return this.cpfSelecionado;
  }

  limparCpf() {
    this.cpfSelecionado = '';
  }
}
