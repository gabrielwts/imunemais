import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdmCadastrarVacina } from '../models/adm_models/adm-cadastrar-vacina';
import { AdmAlterarDadosFuncionario } from '../models/adm_models/adm-alterar-dados-funcionario';


@Injectable({
  providedIn: 'root'
})

export class LoginAdminService {

  private apiUrl = `${environment.apiUrl}/v1/admin`;
  
  constructor(private http: HttpClient) {}

  cadastrar(vacinaCadastro: AdmCadastrarVacina) : Observable<{ mensagem: string }>{
    return this.http.post<{ mensagem: string }>(`${environment.apiUrl}/v1/adm/cadastrar/vacina`, vacinaCadastro);
  }

  getTodosFuncionariosCadastrados(): Observable<{ nome_pro: string, usuario:string, password_prof: string, cargo_prof: string, profile_photo: string }[]> {
    return this.http.get<{ nome_pro: string, usuario:string, password_prof: string, cargo_prof: string, profile_photo: string }[]>(`${environment.apiUrl}/v1/adm/lista/funcionários/cadastrados`);
  }

  deletarFuncionarioCadastrado(usuario: string): Observable<{ mensagem: string }[]> {
    return this.http.delete<{ mensagem: string }[]>(`${environment.apiUrl}/v1/adm/funcionario/deletar?usuario=${usuario}`);
  }

  atualizarFuncionario(alterarDadosFuncionario: AdmAlterarDadosFuncionario): Observable<{ mensagem: string }> {
    return this.http.put<{ mensagem: string }>(`${environment.apiUrl}/v1/adm/funcionario/alterar`, alterarDadosFuncionario)
  }

  atualizarDadosComImagemFuncionario(formData: FormData) {
    return this.http.put<any>(`${environment.apiUrl}/v1/adm/funcionario/alterar-com-foto`, formData);
  }

}
