import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdmEfetuarLogin } from '../models/adm_models/adm-efetuar-login';
import { AdmLoginResponse } from '../models/adm_models/adm-login-response';
import { environment } from '../../environments/environment';
import { AdmEnfermeirosCadatro } from '../models/adm_models/adm-enfermeiros-cadatro';
import { AdmEnfermeirosCadastroResponse } from '../models/adm_models/adm-enfermeiros-cadastro-response';
import { AdmAlterarDadosPaciente } from '../models/adm_models/adm-alterar-dados-paciente';
import { AdmEnfermeirosStatusVacina } from '../models/adm_models/adm-enfermeiros-status-vacina';

@Injectable({
  providedIn: 'root'
})
export class EnfermeirosService {

  private apiUrl = `${environment.apiUrl}/v1/usuarios`;
  
  constructor(private http: HttpClient) {}

  // cadastrar(usuarioCadastro: AdmEnfermeirosCadatro) : Observable<AdmEnfermeirosCadastroResponse>{
  //   return this.http.post<AdmEnfermeirosCadastroResponse>(`${environment.apiUrl}/v1/adm/cadastro`, usuarioCadastro);
  // }

  cadastrarComImagem(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/v1/adm/cadastro`, formData);
  }
  
  AutenticacaoUsuario(efetuarLogin: AdmEfetuarLogin): Observable<AdmLoginResponse> {
    return this.http.post<AdmLoginResponse>(`${environment.apiUrl}/v1/adm/autenticacao`, efetuarLogin);
  }

  getUsuariosPorCpf(cpf: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/v1/interno/paciente/dados?cpf=${cpf}`);
  }

  atualizarDadosPaciente(admAlterarDadosPaciente: AdmAlterarDadosPaciente): Observable<{ mensagem: string }> {
    return this.http.put<{ mensagem: string }>(`${environment.apiUrl}/v1/interno/paciente/atualizardados`, admAlterarDadosPaciente)
  }
   
  getTodosUsuariosCadastrados(): Observable<{ nome_completo: string, cpf: string }[]> {
    return this.http.get<{ nome_completo: string, cpf: string }[]>(`${environment.apiUrl}/v1/interno/lista/pacientes/cadastrados`);
  }

  getTodasAsVacinasCadastradas(): Observable<{ vacinas_nome: string, descricao: string, faixa_etaria: string, doses: string }[]> {
    return this.http.get<{ vacinas_nome: string, descricao: string, faixa_etaria: string, doses: string }[]>(`${environment.apiUrl}/v1/interno/lista/vacinas/cadastradas`);
  }

  atualizarStatusVacina(admEnfermeirosStatusVacina: AdmEnfermeirosStatusVacina): Observable<{ mensagem: string }> {
    return this.http.put<{ mensagem: string }>(`${environment.apiUrl}/v1/interno/paciente/validacao/vacina`, admEnfermeirosStatusVacina)
  }
}
