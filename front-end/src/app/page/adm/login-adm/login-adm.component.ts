import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginAdminService } from '../../../services/admin.service'; // ajuste o caminho
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-adm',
  templateUrl: './login-adm.component.html',
  styleUrls: ['./login-adm.component.scss']
})
export class LoginAdmComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loginAdminService: LoginAdminService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loginAdminService.loginAdmin(this.loginForm.value).subscribe(
      (response) => {
        if (response.success) {
          localStorage.setItem('token', response.token || '');
          this.router.navigate(['/admin/home']);
        } else {
          this.errorMessage = response.message || 'Erro ao fazer login.';
        }
      },
      (error) => {
        this.errorMessage = 'Erro no servidor, tente novamente.';
      }
    );
  }
}
