import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule, Select } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface AgeRange {
  name: string;
}

@Component({
  selector: 'app-cartilha-de-vacinas',
  imports: [InputTextModule, CommonModule, FormsModule, FloatLabelModule, ButtonModule, SelectModule, Select],
  templateUrl: './cartilha-de-vacinas.component.html',
  styleUrl: './cartilha-de-vacinas.component.scss'
})
export class CartilhaDeVacinasComponent implements OnInit {
  cadastrarVac: boolean = false;
  cargo: string = '';
  usuario: string = "";
  
  cadastrarVacina() {
    this.cadastrarVac = !this.cadastrarVac;
  }

  ageRanges: AgeRange[] = []; 
  selectedAgeRange: AgeRange | null = null;

  
  
    constructor(private router: Router) {}
  
  ngOnInit() {
    const usuario = localStorage.getItem('usuario');
      if (usuario) {
        const dados = JSON.parse(usuario);
        this.cargo = dados.profissional; // aqui pega "Profissional"
        console.log('Cargo:', this.cargo);
      }

    this.ageRanges = [
      { name: 'Adolescente' },
      { name: 'Adulto', },
      { name: 'Criança' },
      { name: 'Gestante' },
      { name: 'Idoso' }
    ];
  }
}