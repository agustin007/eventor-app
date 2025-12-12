import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  isLoading = signal(false);
  shake = signal(false);

  // Password Analysis Signals
  passwordValue = signal('');

  passwordMetrics = computed(() => {
    const pwd = this.passwordValue();
    return {
      hasMinLength: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
  });

  passwordStrength = computed(() => {
    const m = this.passwordMetrics();
    let score = 0;
    if (m.hasMinLength) score++;
    if (m.hasUpper) score++;
    if (m.hasLower) score++;
    if (m.hasNumber) score++;
    if (m.hasSpecial) score++;
    return (score / 5) * 100;
  });

  strengthColor = computed(() => {
    const strength = this.passwordStrength();
    if (strength <= 20) return 'bg-red-500';
    if (strength <= 40) return 'bg-orange-500';
    if (strength <= 60) return 'bg-yellow-500';
    if (strength <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  });

  constructor() {
    // Sync password value to signal
    this.registerForm.get('password')?.valueChanges.subscribe(val => {
      this.passwordValue.set(val || '');
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.triggerShake();
      this.toastService.warning('Por favor revisa los campos requeridos');
      return;
    }

    this.isLoading.set(true);
    const { fullName, email, password } = this.registerForm.value;

    this.authService.register({ fullName, email, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success('¡Registro exitoso! Iniciando sesión...');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.triggerShake();
        // Handled by interceptor, but log anyway
        console.error('Registration error', err);
      }
    });
  }

  triggerShake() {
    this.shake.set(true);
    setTimeout(() => this.shake.set(false), 500);
  }

  hasError(controlName: string, errorType: string) {
    const control = this.registerForm.get(controlName);
    return control?.hasError(errorType) && (control.touched || control.dirty);
  }
}
