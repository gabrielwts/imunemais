import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AlterarDadosProfissionalComponent } from './alterar-dados-profissional/alterar-dados-profissional.component';
import { SelectModule } from 'primeng/select';
import { LoginAdminService } from '../../../../services/admin.service';
import { Router } from '@angular/router';
import { AdmEnfermeirosCadatro } from '../../../../models/adm_models/adm-enfermeiros-cadatro';
import { EnfermeirosService } from '../../../../services/enfermeiros.service';
import { PasswordModule } from 'primeng/password';
import { CadastrarProfissionalComponent } from './cadastrar-profissional/cadastrar-profissional.component';

interface userType {
  name: string;
}

@Component({
  selector: 'app-adm-profissionais-cadastrados',
  imports: [CadastrarProfissionalComponent, PasswordModule, InputTextModule, FormsModule, FloatLabelModule, SelectModule, ButtonModule, CommonModule, AlterarDadosProfissionalComponent],
  templateUrl: './adm-profissionais-cadastrados.component.html',
  styleUrl: './adm-profissionais-cadastrados.component.scss'
})
export class AdmProfissionaisCadastradosComponent {
  funcionarios: { nome_pro: string, usuario:string, password_prof: string, cargo_prof: string }[] = [];
  cadastrar: boolean = false;
  alterarPerfil: boolean = false;
  form: AdmEnfermeirosCadatro; 
  
  userTypes: userType[] = [];         // Lista de opções
  selecteduserType: userType | null = null; // Item selecionado
    

  cadastrarUser() {
    this.cadastrar = !this.cadastrar;
  }
  alterarUserProfile() {
    this.alterarPerfil = !this.alterarPerfil;
  }
  
  constructor(private adminService: LoginAdminService, private professionalService: EnfermeirosService, private router: Router) 
  {
    this.form = new AdmEnfermeirosCadatro();
  }

  ngOnInit(): void {
    this.adminService.getTodosFuncionariosCadastrados().subscribe({
      next: (dados) => {
        this.funcionarios = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar funcionarios:', erro);
      }
    });

    this.userTypes = [
      { name: 'Administrador' },
      { name: 'Profissional' },
    ];
  }

  salvar(){console.log("Dados do formulário:", this.form);
    this.professionalService.cadastrar(this.form).subscribe({
      next: professionalService => {
        alert("Usuário cadastrado com sucesso")
      },
      error: erro => {
        alert("Não foi possível cadastrar")
        console.error("Erro ao tentar cadastrar:", erro);
        console.error("Detalhe do erro:", erro.error);
      }
  })
  }

}
