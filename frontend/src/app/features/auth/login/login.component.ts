import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = signal(false);
  shake = signal(false);

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.triggerShake();
      this.toastService.warning('Por favor, completa el formulario correctamente.');
      return;
    }

    this.isLoading.set(true);
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success(`¡Bienvenido de nuevo!`);
        this.router.navigate(['/home']); // Navigating to home after login
      },
      error: (err) => {
        this.isLoading.set(false);
        this.triggerShake();
        // Error handling is managed by ErrorInterceptor, but we can log unique cases if needed
        console.error('Login failed', err);
      }
    });
  }

  triggerShake() {
    this.shake.set(true);
    setTimeout(() => this.shake.set(false), 500); // 500ms duration for shake animation
  }

  // Helper for cleaner template
  hasError(controlName: string, errorType: string) {
    const control = this.loginForm.get(controlName);
    return control?.hasError(errorType) && (control.touched || control.dirty);
  }
}
