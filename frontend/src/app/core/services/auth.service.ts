import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface User {
  fullName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  expiration: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  // State signals
  currentUser = signal<User | null>(null);

  // Computed signals
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');

    if (user && token && expiration) {
      if (this.isTokenExpired(expiration)) {
        this.logout();
      } else {
        this.currentUser.set(JSON.parse(user));
      }
    } else {
      // Garbage collection if incomplete
      if (token || user) this.logout();
    }
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('expiration', response.expiration);
        this.currentUser.set(response.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expiration');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private isTokenExpired(expiration: string): boolean {
    const expireDate = new Date(expiration);
    return expireDate < new Date();
  }


}
