import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginAdminRequest {
  username: string;
  password: string;
}

interface LoginAdminResponse {
  token?: string;  // ou qualquer resposta que seu backend retorne
  message?: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoginAdminService {
  private apiUrl = `${environment.apiUrl}/v1/admin`;

  constructor(private http: HttpClient) {}

  loginAdmin(data: LoginAdminRequest): Observable<LoginAdminResponse> {
    return this.http.post<LoginAdminResponse>(this.apiUrl, data);
  }
}
