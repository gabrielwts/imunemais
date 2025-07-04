import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule, Select } from 'primeng/select';
import { EnfermeirosService } from '../../../../../services/enfermeiros.service';
import { Route, Router } from '@angular/router';
import { AdmEnfermeirosCadatro } from '../../../../../models/adm_models/adm-enfermeiros-cadatro';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

interface userType {
  name: string;
}

@Component({
  selector: 'app-cadastrar-profissional',
  imports: [InputTextModule, FormsModule, FloatLabelModule, ButtonModule, SelectModule, CommonModule, DropdownModule],
  templateUrl: './cadastrar-profissional.component.html',
  styleUrl: './cadastrar-profissional.component.scss'
})
export class CadastrarProfissionalComponent implements OnInit {
  userTypes: userType[] = [];         // Lista de opções
  selecteduserType: userType | null = null; // Item selecionado

  ngOnInit() {
    this.userTypes = [
      { name: 'Administrador' },
      { name: 'Profissional' },
    ];
  }

  form: AdmEnfermeirosCadatro;

  constructor(private professionalService: EnfermeirosService, private router: Router){
    this.form = new AdmEnfermeirosCadatro();
  }

  salvar(){console.log("Dados do formulário:", this.form);
    this.professionalService.cadastrar(this.form).subscribe({
      next: professionalService => {
        alert("Usuário cadastrado com sucesso")
        // this.router.navigate(["/cadastro/senha"], {state: { id: professionalService.id }})
      },
      error: erro => {
        alert("Não foi possível cadastrar")
        console.error("Erro ao tentar cadastrar:", erro);
        console.error("Detalhe do erro:", erro.error);
      }
  })
  }
}