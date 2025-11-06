import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioCadastro } from '../models/usuario-cadastro';
import { Observable } from 'rxjs';
import { UsuarioCadastroResponse } from '../models/usuario-cadastro-response';
import { LoginResponse } from '../models/login-response';
import { environment } from '../../environments/environment';
import { SenhaCadastro } from '../models/senha-cadastro';
import { EfetuarLogin } from '../models/efetuar-login';
import { RecuperarSenhaCpf } from '../models/recuperar-senha-cpf';
import { RecuperarSenhaResponse } from '../models/recuperar-senha-response';
import { AlterarDadosPaciente } from '../models/alterar-dados-paciente';
import { RecuperarSenhaEmail } from '../models/recuperar-senha-email';
import { RecuperarSenhaCadastro } from '../models/recuperar-senha-cadastro';
import { RecuperarEmailSenhaCadastro } from '../models/recuperar-email-senha-cadastro';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/v1/usuarios`;

  constructor(private http: HttpClient) {}

  cadastrar(usuarioCadastro: UsuarioCadastro) : Observable<UsuarioCadastroResponse>{
    return this.http.post<UsuarioCadastroResponse>(this.apiUrl, usuarioCadastro);
  }

  cadastrarSenha(id: number, senhaCadastro: SenhaCadastro) : Observable<UsuarioCadastroResponse>{
    return this.http.post<UsuarioCadastroResponse>(`${this.apiUrl}/senha?id=${id}`, senhaCadastro);
  }

  AutenticacaoUsuario(efetuarLogin: EfetuarLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/v1/autenticacao`, efetuarLogin);
  }

  RecuperarSenhaCpf(recuperarSenhaCpf: RecuperarSenhaCpf): Observable<RecuperarSenhaResponse> {
    return this.http.post<RecuperarSenhaResponse>(`${environment.apiUrl}/v1/usuarios/recuperarsenha`, recuperarSenhaCpf)
  }

  RecuperarSenhaEmail(recuperarSenhaEmail: RecuperarSenhaEmail): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/v1/codigo-email-recuperar`, recuperarSenhaEmail)
  }

  RecuperarSenhaNovoEmail(recuperarEmailSenhaCadastro: RecuperarEmailSenhaCadastro): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/v1/codigo-diferente-novo-email-recuperar`, recuperarEmailSenhaCadastro)
  }

  RecuperarCadastroNovaSenha(cpfSalvo: string, recuperarSenhaCadastro: RecuperarSenhaCadastro) : Observable<null>{
    return this.http.post<null>(`${this.apiUrl}/recuperar-cadastro-senha?cpfSalvo=${cpfSalvo}`, recuperarSenhaCadastro);
  }

  // AtualizarDados(alterarDadosPaciente: AlterarDadosPaciente): Observable<{ mensagem: string, telefone: string, email: string }> {
  //   return this.http.put<{ mensagem: string, telefone: string, email: string }>(`${environment.apiUrl}/v1/usuarios/atualizardados`, alterarDadosPaciente)
  // }

  AtualizarDadosComImagem(dados: FormData) {
    return this.http.put<any>(`${environment.apiUrl}/v1/usuarios/atualizardados`, dados);
  }

  getVacinasPorCpf(cpf: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/v1/paciente/vacinas?cpf=${cpf}`);
  }

  downloadCarteira(cpf: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/v1/usuarios/carteira-vacina/${cpf}`, {
      responseType: 'blob'
    });
  }

}