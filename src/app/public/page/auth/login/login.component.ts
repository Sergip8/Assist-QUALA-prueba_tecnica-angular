import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../../_core/services/auth.service';
import { LoginRequest } from '../../../../models/login.model';
import { Role } from '../../../../_core/guard/role.guard';
import { AdminRoutes } from '../../../../admin/admin.routes';
import { AppRoutes } from '../../../../app.routes';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['../auth.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  passwordVisible = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const credentials: LoginRequest = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.message.success('¡Bienvenido!');
            if(response.data.user.rol == Role.ADMIN)
              this.router.navigate([AppRoutes.Admin]);
            if(response.data.user.rol == Role.CUSTOMER)
              this.router.navigate([AppRoutes.Public]);
          } else {
            this.message.error(response.message || 'Error en el inicio de sesión');
          }
        },
        error: (error) => {
          this.loading = false;
          this.message.error('Error en el servidor. Intente nuevamente.');
          console.error('Login error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}