import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioCadastro } from '../models/usuario-cadastro';
import { Observable } from 'rxjs';
import { UsuarioCadastroResponse } from '../models/usuario-cadastro-response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/v1/usuarios`;

  constructor(private http: HttpClient) {}

  cadastrar(usuarioCadastro: UsuarioCadastro) : Observable<UsuarioCadastroResponse>{
    return this.http.post<UsuarioCadastroResponse>(this.apiUrl, usuarioCadastro);
  }
}
