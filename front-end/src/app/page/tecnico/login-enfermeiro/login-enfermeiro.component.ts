import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-enfermeiro',
  standalone: true,
  templateUrl: './login-enfermeiro.component.html',
  styleUrls: ['./login-enfermeiro.component.scss']
})
export class LoginEnfermeiroComponent {
  nome = '';
  cpf = '';

  constructor(private http: HttpClient, private router: Router) {}

  logar() {
    this.http.post('http://localhost:8000/enfermeiros/login', {
      nome: this.nome,
      cpf: this.cpf
    }).subscribe({
      next: () => this.router.navigate(['/sistema-enfermeiro']),
      error: () => alert('Login inválido')
    });
  }
}
