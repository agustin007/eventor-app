import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { AuthService } from '@core/services/auth.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';

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
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // State signals
  profile = signal<Profile | null>(null);
  isLoading = signal(true);

  // Tabs State
  activeTab = signal<'profile' | 'config'>('profile');

  // Config State (Mocked for now)
  config = signal({
    subscription: 'free',
    userType: 'attendee', // attendee | organizer
    darkMode: true,
    notifications: true
  });

  // Computed - initials from name
  initials = signal('U');

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (data: any) => {
        this.profile.set(data);
        this.initials.set(this.getInitials(data.name));
        this.isLoading.set(false);
      },
      error: (err: any) => {
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
