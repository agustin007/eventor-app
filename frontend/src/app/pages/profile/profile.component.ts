import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

interface Profile {
  name: string;
  email: string;
  level: string;
  points: number;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 max-w-4xl mx-auto">
      <!-- Loading -->
      <app-loader [show]="isLoading()" [message]="'Cargando perfil...'" />

      @if (!isLoading() && profile()) {
        <!-- Profile Header -->
        <div class="bg-gradient-to-r from-accent/20 to-secondary/20 border border-white/10 rounded-2xl p-8 flex items-center mb-8">
          <div class="h-24 w-24 rounded-full bg-gradient-to-tr from-accent to-secondary flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-accent/25">
            {{ initials() }}
          </div>
          <div class="ml-6">
            <h2 class="text-3xl font-bold text-white">{{ profile()!.name }}</h2>
            <p class="text-gray-400">{{ profile()!.email }}</p>
            <div class="flex items-center mt-3 space-x-4">
              <span class="px-3 py-1 bg-white/10 rounded-full text-sm text-white border border-white/10">
                🏆 {{ profile()!.level }}
              </span>
              <span class="px-3 py-1 bg-white/10 rounded-full text-sm text-white border border-white/10">
                💎 {{ profile()!.points }} Puntos
              </span>
            </div>
          </div>
        </div>

        <!-- Settings Sections -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Preferences -->
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 class="text-xl font-bold text-white mb-4">Preferencias</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-300">Notificaciones Email</span>
                <button 
                  (click)="toggleEmailNotifications()"
                  [class.bg-accent]="emailNotifications()"
                  [class.bg-gray-600]="!emailNotifications()"
                  class="w-10 h-6 rounded-full relative cursor-pointer transition-colors">
                  <div 
                    [class.right-1]="emailNotifications()"
                    [class.left-1]="!emailNotifications()"
                    class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all">
                  </div>
                </button>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-300">Modo Oscuro</span>
                <button 
                  disabled
                  class="w-10 h-6 bg-accent rounded-full relative cursor-not-allowed opacity-75">
                  <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          </div>

          <!-- Security -->
          <div class="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 class="text-xl font-bold text-white mb-4">Seguridad</h3>
            <button 
              (click)="changePassword()"
              class="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg mb-3 transition-colors text-left px-4">
              Cambiar Contraseña
            </button>
            <button 
              (click)="logout()"
              class="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-left px-4">
              Cerrar Sesión
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-primary-400">12</div>
            <div class="text-gray-400 text-sm mt-1">Eventos Asistidos</div>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-green-400">5</div>
            <div class="text-gray-400 text-sm mt-1">Tickets Activos</div>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div class="text-3xl font-bold text-yellow-400">{{ profile()!.points }}</div>
            <div class="text-gray-400 text-sm mt-1">Puntos XP</div>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // State signals
  profile = signal<Profile | null>(null);
  isLoading = signal(true);
  emailNotifications = signal(true);

  // Computed - initials from name
  initials = signal('U');

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.initials.set(this.getInitials(data.name));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.isLoading.set(false);
      }
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  toggleEmailNotifications() {
    this.emailNotifications.update(val => !val);
    console.log('Email notifications:', this.emailNotifications());
  }

  changePassword() {
    alert('Funcionalidad de cambio de contraseña - Por implementar');
  }

  logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
