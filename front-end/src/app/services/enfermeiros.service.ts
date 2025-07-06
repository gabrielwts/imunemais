import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdmEfetuarLogin } from '../models/adm_models/adm-efetuar-login';
import { AdmLoginResponse } from '../models/adm_models/adm-login-response';
import { environment } from '../../environments/environment';
import { AdmEnfermeirosCadatro } from '../models/adm_models/adm-enfermeiros-cadatro';
import { AdmEnfermeirosCadastroResponse } from '../models/adm_models/adm-enfermeiros-cadastro-response';

@Injectable({
  providedIn: 'root'
})
export class EnfermeirosService {

  private apiUrl = `${environment.apiUrl}/v1/usuarios`;
  
  constructor(private http: HttpClient) {}

  cadastrar(usuarioCadastro: AdmEnfermeirosCadatro) : Observable<AdmEnfermeirosCadastroResponse>{
    return this.http.post<AdmEnfermeirosCadastroResponse>(`${environment.apiUrl}/v1/adm/cadastro`, usuarioCadastro);
  }
  
  AutenticacaoUsuario(efetuarLogin: AdmEfetuarLogin): Observable<AdmLoginResponse> {
    return this.http.post<AdmLoginResponse>(`${environment.apiUrl}/v1/adm/autenticacao`, efetuarLogin);
  }

  getUsuariosPorCpf(cpf: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/v1/interno/paciente/dados?cpf=${cpf}`);
  }
}
