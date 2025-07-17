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
import { AlterarDadosPaciente } from '../../../../models/alterar-dados-paciente';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface userType {
  name: string;
}

@Component({
  selector: 'app-adm-profissionais-cadastrados',
  imports: [ PasswordModule, InputTextModule, FormsModule, FloatLabelModule, SelectModule, ButtonModule, CommonModule, ToastModule, RippleModule],
  templateUrl: './adm-profissionais-cadastrados.component.html',
  styleUrl: './adm-profissionais-cadastrados.component.scss',
  providers: [MessageService]
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

  formCadastrar: AdmEnfermeirosCadatro = new AdmEnfermeirosCadatro();
  formEditar: AdmEnfermeirosCadatro = new AdmEnfermeirosCadatro();
    

  cadastrarUser() {
    this.cadastrar = !this.cadastrar;
  }

  alterarUserProfile(funcionario: AdmEnfermeirosCadatro) {
    this.alterarPerfil = true;

    // guarda o original para identificar quem está sendo alterado
    this.funcionarioSelecionadoOriginal = funcionario;

    // preenche o form de edição com os dados do funcionário
    this.formEditar = {
      nome_pro: funcionario.nome_pro,
      usuario: funcionario.usuario,
      password_prof: funcionario.password_prof, // senha em branco por segurança
      cargo_prof: funcionario.cargo_prof
    };
  }
  
  constructor(private adminService: LoginAdminService, private professionalService: EnfermeirosService, private messageService: MessageService, private router: Router) 
  {
    this.form = new AdmEnfermeirosCadatro();
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Usuário cadastrado!', detail: 'Cadastro realizado com sucesso.', life: 3000 });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Erro ao cadastrar o usuário', detail: 'Não foi possível realizar o cadastro, verifique os dados antes do envio!' });
  }

  showAlterarSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Alterações realizadas!', detail: 'Dados atualizados com sucesso.', life: 3000 });
  }

  showAlterarError() {
    this.messageService.add({ severity: 'error', summary: 'Erro ao alterar dados!', detail: 'Verifique os dados antes do envio.' });
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
    const nome = this.formCadastrar.nome_pro?.trim();
    const usuario = this.formCadastrar.usuario?.trim();
    const senha = this.formCadastrar.password_prof?.trim();
    const cargo = this.formCadastrar.cargo_prof;

    if (!nome || !usuario || !senha || !cargo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Campos obrigatórios',
        detail: 'Todos os campos devem ser preenchidos corretamente.'
      });
      return;
    }

    this.botaoDesativado = true;
    this.professionalService.cadastrar(this.formCadastrar).subscribe({
      next: () => {
        this.showSuccess()
        this.formCadastrar = new AdmEnfermeirosCadatro();
        this.carregarFuncionarios();
      },
      error: erro => {
        this.showError()
        console.error("Erro ao tentar cadastrar:", erro);
        console.error("Detalhe do erro:", erro.error);
      }
    });

    setTimeout(() => {
      this.botaoDesativado = false;
    }, 3000);
  }

  abrirFormularioEdicao(funcionario: AdmEnfermeirosCadatro) {
    this.alterarPerfil = true;
    this.funcionarioSelecionadoOriginal = funcionario;

    this.formEditar = {
      nome_pro: funcionario.nome_pro,
      usuario: funcionario.usuario,
      password_prof: funcionario.password_prof, // senha vazia
      cargo_prof: funcionario.cargo_prof
    };
  }

  alterarDadosFuncionario() {
    const nome = this.formEditar.nome_pro?.trim();
    const usuario = this.formEditar.usuario?.trim();
    const senha = this.formEditar.password_prof?.trim();
    const cargo = this.formEditar.cargo_prof;

    if (!nome || !usuario || !senha || !cargo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Campos obrigatórios',
        detail: 'Todos os campos devem ser preenchidos.'
      });
      return;
    }

    const dados = {
      usuario_original: this.funcionarioSelecionadoOriginal.usuario,
      nome_pro: nome,
      usuario: usuario,
      password_prof: senha,
      cargo_prof: cargo
    };

    this.adminService.atualizarFuncionario(dados).subscribe({
      next: () => {
        this.showAlterarSuccess();
        this.alterarPerfil = false;
        this.formEditar = new AdmEnfermeirosCadatro();
        this.carregarFuncionarios();
      },
      error: (erro) => {
        this.showAlterarError();
        console.error("Erro ao atualizar funcionário:", erro.error || erro);
      }
    });
  }

  // alterarDadosFuncionario() {
  //   const dados: any = {
  //     usuario_original: this.funcionarioSelecionadoOriginal.usuario // ← identificador original
  //   };

  //   if (this.form.nome_pro && this.form.nome_pro.trim() !== "" && this.form.nome_pro !== this.funcionarioSelecionadoOriginal.nome_pro) {
  //     dados.nome_pro = this.form.nome_pro;
  //   }

  //   if (this.form.usuario && this.form.usuario.trim() !== "" && this.form.usuario !== this.funcionarioSelecionadoOriginal.usuario) {
  //     dados.usuario = this.form.usuario;
  //   }

  //   if (this.form.password_prof && this.form.password_prof.trim() !== "") {
  //     dados.password_prof = this.form.password_prof;
  //   }

  //   if (this.form.cargo_prof && typeof this.form.cargo_prof === 'string' && this.form.cargo_prof !== this.funcionarioSelecionadoOriginal.cargo_prof) {
  //     dados.cargo_prof = this.form.cargo_prof;
  //   }

  //   this.adminService.atualizarFuncionario(dados).subscribe({
  //     next: () => {
  //       this.showAlterarSuccess()
  //       this.alterarPerfil = false;
  //       this.carregarFuncionarios();
  //       this.alterarForm = new AlterarDadosPaciente();
  //     },
  //     error: (erro) => {
  //       this.showAlterarError()
  //       console.error("Erro ao atualizar funcionário:", erro.error || erro);
  //     }
  //   });
  // }

  // removerFuncionario() {
  //   if (!this.form.usuario) return;

  //   const confirmar = confirm(`Tem certeza que deseja remover o funcionário "${this.form.nome_pro}"?`);
  //   if (!confirmar) return;

  //   this.adminService.deletarFuncionarioCadastrado(this.form.usuario).subscribe({
  //     next: (res) => {
  //       alert(res);
  //       this.carregarFuncionarios();
  //       this.alterarPerfil = false;
  //       this.form = new AdmEnfermeirosCadatro();
  //     },
  //     error: (err) => {
  //       console.error('Erro ao deletar:', err);
  //       alert('Erro ao deletar funcionário.');
  //     }
  //   });
  // }

  usuarioParaExcluir: string = '';
  nomeParaExcluir: string = '';

  // showDeleteConfirm(usuario: string, nome: string) {
  //   this.usuarioParaExcluir = usuario;
  //   this.nomeParaExcluir = nome;

  //   this.messageService.add({
  //     key: 'confirm',
  //     sticky: true,
  //     severity: 'warn',
  //     summary: 'Confirmação de Exclusão',
  //     detail: `Deseja remover o funcionário "${nome}"?`
  //   });
  // }

  showDeleteConfirm() {
    this.usuarioParaExcluir = this.formEditar.usuario;
    this.nomeParaExcluir = this.formEditar.nome_pro;

    this.messageService.add({
      key: 'confirm',
      sticky: true,
      severity: 'warn',
      summary: 'Confirmação de Exclusão',
      detail: `Deseja remover o funcionário "${this.nomeParaExcluir}"?`
    });
  }

  onConfirmDelete() {
    this.messageService.clear('confirm');

    this.adminService.deletarFuncionarioCadastrado(this.usuarioParaExcluir).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Perfil deletado!',
          detail: `Usuário removido com sucesso.`
        });

        this.carregarFuncionarios();
        this.alterarPerfil = false;
        this.form = new AdmEnfermeirosCadatro();
      },
      error: (err) => {
        console.error('Erro ao deletar:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao deletar funcionário',
          detail: err?.error?.detail || 'Erro inesperado.'
        });
      }
    });
  }

  onReject() {
    this.messageService.clear('confirm');
  }

}
