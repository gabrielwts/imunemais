import { Component, HostListener, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { AlterarDadosPaciente } from '../../../../models/alterar-dados-paciente';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../../services/usuario.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-perfil',
  imports: [ DatePipe ,ButtonModule, InputMaskModule, InputTextModule, CommonModule, FormsModule, ToastModule, RippleModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
  providers: [MessageService]

})
export class PerfilComponent implements OnInit {
  @ViewChild('inputImagem') inputImagemRef!: ElementRef<HTMLInputElement>;
  paciente: any = {};
  nome: string = "";
  cpf: string = "";
  data_nascimento: string = "";
  telefone: string = "";
  email: string = "";
  telefoneInvalido = false;
  imagem_perfil: string = "";
  
  form!: AlterarDadosPaciente;
  alterarInfo: boolean = true;

  numeroTelefone: string = "";

  previewImagem: string | ArrayBuffer | null = null;
  imagemArquivo!: File;

  dispararInputImagem() {
    this.inputImagemRef.nativeElement.click();
  }

  // getImagemUrl(): string {
  //   const baseUrl = 'http://localhost:8000';
  //   if (this.imagem_perfil?.startsWith('/static')) {
  //     const caminhoCompleto = baseUrl + this.imagem_perfil;
  //     console.log('Caminho da imagem:', caminhoCompleto); // <-- veja o que aparece aqui
  //     return caminhoCompleto;
  //   }
  //   return '/standard-user.jpg';
  // }

  getImagemUrl(): string {
    const baseUrl = 'http://localhost:8000';

    // Prioriza imagem ainda não enviada (preview)
    if (this.previewImagem) {
      return this.previewImagem.toString();
    }

    // Imagem já salva no servidor
    if (this.imagem_perfil?.startsWith('/static')) {
      const caminhoCompleto = baseUrl + this.imagem_perfil;
      console.log('Caminho da imagem:', caminhoCompleto);
      return caminhoCompleto;
    }

    // Imagem padrão
    return '/standard-user.jpg';
  }

  validarTelefone() {
    const tel = this.form.telefone;

    if (!tel || tel.length < 14) {
      this.telefoneInvalido = true;
      return;
    }

    const apenasNumeros = tel.replace(/\D/g, '');

    this.telefoneInvalido = apenasNumeros[2] !== '9';
  }

  mostrarInputs() {
    this.alterarInfo = !this.alterarInfo;
  }

  salvarAlteracao() {
    this.alterarDados();
    this.alterarInfo = true; 
  }

  constructor(private usuarioService: UsuarioService, private messageService: MessageService, private router: Router){
    this.form = new AlterarDadosPaciente();
  }

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Erro ao atualizar dados!', detail: 'Número inválido, corrija o número de telefone.', life: 3000 });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Não foi possível atualizar os dados!', detail: 'Número ou e-mail inválido, verifique antes de enviar.', life: 3250 });
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Alterações realizadas!', detail: 'Dados atualizados com sucesso.', life: 3000 });
  }

  // onFileSelected(event: Event) {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files && fileInput.files.length > 0) {
  //     this.imagemArquivo = fileInput.files[0];

  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       this.previewImagem = e.target?.result ?? null;
  //     };
  //     reader.readAsDataURL(this.imagemArquivo);
  //   }
  // }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.imagemArquivo = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImagem = e.target?.result ?? null;
        console.log('Preview da imagem carregado:', this.previewImagem);
      };
      reader.readAsDataURL(this.imagemArquivo);
    }
  }

  // alterarDados() {
  //   const dados: any = {
  //     cpf: this.cpf
  //   };

  //   let telefoneSendoEditado = false;

  //   if (this.form.telefone && this.form.telefone.trim() !== "") {
  //     this.validarTelefone(); 
  //     telefoneSendoEditado = true;

  //     if (this.telefoneInvalido) {
  //       this.showWarn()
  //       this.form = new AlterarDadosPaciente();
  //       return;
  //     }

  //     dados.telefone = this.form.telefone;
  //   }

  //   if (this.form.email && this.form.email.trim() !== "") {
  //     dados.email = this.form.email;
  //     this.form = new AlterarDadosPaciente();
  //   }

  //   if (!dados.telefone && !dados.email) {
  //     return;
  //   }

  //   this.usuarioService.AtualizarDados(dados).subscribe({
  //     next: response => {
  //       this.showSuccess()

  //       this.form.telefone = response.telefone || this.form.telefone;
  //       this.form.email = response.email || this.form.email;

  //       this.telefone = this.form.telefone ?? '';
  //       this.email = this.form.email ?? '';

  //       const dadosOriginais = JSON.parse(localStorage.getItem('usuario') || '{}');
  //       const novosDados = {
  //         ...dadosOriginais,
  //         telefone: response.telefone ?? dadosOriginais.telefone,
  //         email: response.email ?? dadosOriginais.email
  //       };
  //       localStorage.setItem('usuario', JSON.stringify(novosDados));
  //       // console.log("LocalStorage atualizado com os novos dados.");
  //     },
  //     error: erro => {
  //       this.showError()
  //       this.form = new AlterarDadosPaciente();
  //     }
  //   });
  // }

  alterarDados() {
    const formData = new FormData();

    formData.append('cpf', this.cpf);

    let algumaCoisaFoiAlterada = false;

    // TELEFONE
    if (this.form.telefone && this.form.telefone.trim() !== "") {
      this.validarTelefone(); 
      if (this.telefoneInvalido) {
        this.showWarn();
        this.form = new AlterarDadosPaciente();
        return;
      }
      formData.append('telefone', this.form.telefone);
      algumaCoisaFoiAlterada = true;
    }

    // EMAIL
    if (this.form.email && this.form.email.trim() !== "") {
      formData.append('email', this.form.email);
      algumaCoisaFoiAlterada = true;
    }

    // IMAGEM DE PERFIL
    if (this.imagemArquivo) {
      formData.append('imagem_perfil', this.imagemArquivo);
      algumaCoisaFoiAlterada = true;
    }

    if (!algumaCoisaFoiAlterada) {
      this.messageService.add({ 
        severity: 'info', 
        summary: 'Nenhum dado alterado', 
        detail: 'Nenhuma alteração de dados foi feita.' 
      });
      return;
    }

    this.usuarioService.AtualizarDadosComImagem(formData).subscribe({
      next: response => {
        this.showSuccess();

        this.form.telefone = response.telefone || this.form.telefone;
        this.form.email = response.email || this.form.email;
        this.telefone = this.form.telefone ?? '';
        this.email = this.form.email ?? '';
        if (response.imagem_perfil) {
          this.imagem_perfil = response.imagem_perfil;
        }

        const dadosOriginais = JSON.parse(localStorage.getItem('paciente') || '{}');
        const novosDados = {
          ...dadosOriginais,
          telefone: response.telefone ?? dadosOriginais.telefone,
          email: response.email ?? dadosOriginais.email,
          imagem_perfil: response.imagem_perfil ?? dadosOriginais.imagem_perfil
        };
        localStorage.setItem('paciente', JSON.stringify(novosDados));
        location.reload();
      },
      error: erro => {
        this.showError();
        this.form = new AlterarDadosPaciente();
      }
    });
  }

  ngOnInit() {
  
    const usuarioData: string | null = localStorage.getItem('paciente');

    if (usuarioData) {
      const paciente = JSON.parse(usuarioData);
      this.nome = paciente.nome || 'Visitante';
      this.cpf = paciente.cpf
      this.data_nascimento = paciente.data_nascimento
      this.telefone = paciente.telefone
      this.email = paciente.email
      this.imagem_perfil = paciente.imagem_perfil
    } else {
      console.warn("Usuário não encontrado no localStorage.");
      this.nome = 'Visitante';
    }
  }

}