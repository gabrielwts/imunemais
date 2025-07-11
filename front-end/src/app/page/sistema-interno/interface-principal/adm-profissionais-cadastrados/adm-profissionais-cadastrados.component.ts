import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { LoginAdminService } from '../../../../services/admin.service';
import { Router } from '@angular/router';
import { AdmEnfermeirosCadatro } from '../../../../models/adm_models/adm-enfermeiros-cadatro';
import { EnfermeirosService } from '../../../../services/enfermeiros.service';
import { PasswordModule } from 'primeng/password';
import { CadastrarProfissionalComponent } from './cadastrar-profissional/cadastrar-profissional.component';
import { AlterarDadosPaciente } from '../../../../models/alterar-dados-paciente';

interface userType {
  name: string;
}

@Component({
  selector: 'app-adm-profissionais-cadastrados',
  imports: [ PasswordModule, InputTextModule, FormsModule, FloatLabelModule, SelectModule, ButtonModule, CommonModule],
  templateUrl: './adm-profissionais-cadastrados.component.html',
  styleUrl: './adm-profissionais-cadastrados.component.scss'
})
export class AdmProfissionaisCadastradosComponent {
  funcionarios: { nome_pro: string, usuario:string, password_prof: string, cargo_prof: string }[] = [];
  cadastrar: boolean = false;
  alterarPerfil: boolean = false;
  form: AdmEnfermeirosCadatro;
  alterarForm!: AlterarDadosPaciente; 
  botaoDesativado = false;
  userTypes: userType[] = [];         // Lista de opções
  selecteduserType: userType | null = null; // Item selecionado
  funcionarioSelecionadoOriginal: any = null;
  filtroPesquisa: string = '';
  funcionariosFiltrados: { nome_pro: string, usuario: string, password_prof: string, cargo_prof: string }[] = [];
    

  cadastrarUser() {
    this.cadastrar = !this.cadastrar;
  }
  alterarUserProfile(funcionario: any) {
    this.alterarPerfil = true;

    this.form = { ...funcionario };
    this.selecteduserType = this.userTypes.find(type => type.name === funcionario.cargo_prof) || null;
    this.funcionarioSelecionadoOriginal = { ...funcionario };
  }
  
  constructor(private adminService: LoginAdminService, private professionalService: EnfermeirosService, private router: Router) 
  {
    this.form = new AdmEnfermeirosCadatro();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.cadastrar) {
      this.cadastrar = false;
    }

    if (this.alterarPerfil) {
      this.alterarPerfil = false;
    }
  }

  ngOnInit(): void {
    this.carregarFuncionarios();

    this.userTypes = [
      { name: 'Administrador' },
      { name: 'Profissional' },
    ];
  }

  carregarFuncionarios() {
    this.adminService.getTodosFuncionariosCadastrados().subscribe({
      next: (dados) => {
        this.funcionarios = dados;
        this.funcionariosFiltrados = dados;
      },
      error: (erro) => {
        console.error('Erro ao buscar funcionarios:', erro);
      }
    });
  }

  filtrarFuncionarios() {
    const termoBusca = this.filtroPesquisa.trim().toLowerCase();
    
    this.funcionariosFiltrados = this.funcionarios.filter(func => {
      return func.nome_pro.toLowerCase().includes(termoBusca);
    });
  }

  formAlterado(): boolean {
    if (!this.funcionarioSelecionadoOriginal) return false;

    return (
      this.form.nome_pro !== this.funcionarioSelecionadoOriginal.nome_pro ||
      this.form.usuario !== this.funcionarioSelecionadoOriginal.usuario ||
      this.form.password_prof !== this.funcionarioSelecionadoOriginal.password_prof ||
      this.form.cargo_prof !== this.funcionarioSelecionadoOriginal.cargo_prof
    );
  }

  salvar() {
    console.log("Dados do formulário:", this.form);

    this.botaoDesativado = true;
    this.professionalService.cadastrar(this.form).subscribe({
      next: () => {
        alert("Usuário cadastrado com sucesso");
        this.form = new AdmEnfermeirosCadatro();
        this.carregarFuncionarios();
      },
      error: erro => {
        alert("Não foi possível cadastrar");
        console.error("Erro ao tentar cadastrar:", erro);
        console.error("Detalhe do erro:", erro.error);
      }
    });

    setTimeout(() => {
      this.botaoDesativado = false;
    }, 3000);
  }

  alterarDadosFuncionario() {
    const dados: any = {
      usuario_original: this.funcionarioSelecionadoOriginal.usuario // ← identificador original
    };

    if (this.form.nome_pro && this.form.nome_pro.trim() !== "" && this.form.nome_pro !== this.funcionarioSelecionadoOriginal.nome_pro) {
      dados.nome_pro = this.form.nome_pro;
    }

    if (this.form.usuario && this.form.usuario.trim() !== "" && this.form.usuario !== this.funcionarioSelecionadoOriginal.usuario) {
      dados.usuario = this.form.usuario;
    }

    if (this.form.password_prof && this.form.password_prof.trim() !== "") {
      dados.password_prof = this.form.password_prof;
    }

    if (this.form.cargo_prof && typeof this.form.cargo_prof === 'string' && this.form.cargo_prof !== this.funcionarioSelecionadoOriginal.cargo_prof) {
      dados.cargo_prof = this.form.cargo_prof;
    }

    this.adminService.atualizarFuncionario(dados).subscribe({
      next: () => {
        alert("Dados atualizados com sucesso!");
        this.alterarPerfil = false;
        this.carregarFuncionarios(); // atualiza a lista
      },
      error: (erro) => {
        alert("Erro ao atualizar dados!");
        console.error("Erro ao atualizar funcionário:", erro.error || erro);
      }
    });
  }

  removerFuncionario() {
    if (!this.form.usuario) return;

    const confirmar = confirm(`Tem certeza que deseja remover o funcionário "${this.form.nome_pro}"?`);
    if (!confirmar) return;

    this.adminService.deletarFuncionarioCadastrado(this.form.usuario).subscribe({
      next: (res) => {
        alert(res);
        this.carregarFuncionarios();       // Atualiza lista
        this.alterarPerfil = false;        // Fecha o formulário
        this.form = new AdmEnfermeirosCadatro(); // Limpa o form
      },
      error: (err) => {
        console.error('Erro ao deletar:', err);
        alert('Erro ao deletar funcionário.');
      }
    });
  }

}
