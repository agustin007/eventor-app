import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Category {
  title: string;
  description: string;
  image: string;
  route: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full h-[calc(100vh-4rem)] overflow-y-auto bg-primary">
      <!-- Hero Section -->
      <div class="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <!-- Background Image -->
        <div class="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600"
            alt="Party Crowd" 
            class="w-full h-full object-cover opacity-40">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-primary"></div>
        </div>

        <!-- Hero Content -->
        <div class="relative z-10 text-center px-4">
          <h1 class="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent to-secondary animate-fade-in-up">
            Descubre Córdoba
          </h1>
          <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-100">
            La guía definitiva de eventos, vida nocturna y cultura. Encuentra tu próximo plan en segundos.
          </p>
          <div class="flex justify-center space-x-4 animate-fade-in-up delay-200">
            <button 
              routerLink="/discover"
              class="px-8 py-3 bg-gradient-to-r from-accent to-secondary hover:from-indigo-600 hover:to-pink-600 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-accent/25">
              Explorar Eventos
            </button>
          </div>
        </div>
      </div>

      <!-- Featured Categories -->
      <div class="max-w-7xl mx-auto px-8 py-12">
        <h2 class="text-2xl font-bold text-white mb-8">Categorías Populares</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (category of categories(); track category.title) {
            <div 
              [routerLink]="category.route"
              class="h-64 rounded-2xl relative overflow-hidden group cursor-pointer">
              <img 
                [src]="category.image"
                [alt]="category.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                <h3 class="text-2xl font-bold text-white group-hover:text-accent transition-colors">
                  {{ category.title }}
                </h3>
                <p class="text-gray-300 text-sm">{{ category.description }}</p>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Stats Section (nuevo) -->
      <div class="max-w-7xl mx-auto px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (stat of stats(); track stat.label) {
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center hover:border-primary-500/50 transition-all">
              <div class="text-4xl font-bold text-primary-400 mb-2">{{ stat.value }}</div>
              <div class="text-gray-300">{{ stat.label }}</div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent {
  // Static data as signals (could be fetched from API in the future)
  categories = signal<Category[]>([
    {
      title: 'Vida Nocturna',
      description: 'Bares, Boliches y Afters',
      image: 'https://images.unsplash.com/photo-1514525253440-b393452e3726?auto=format&fit=crop&q=80&w=800',
      route: '/discover'
    },
    {
      title: 'Gastronomía',
      description: 'Restaurantes y Festivales',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
      route: '/discover'
    },
    {
      title: 'Naturaleza',
      description: 'Trekking y Aire Libre',
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800',
      route: '/discover'
    }
  ]);

  stats = signal([
    { value: '1000+', label: 'Eventos Publicados' },
    { value: '50K+', label: 'Usuarios Activos' },
    { value: '500+', label: 'Organizadores' }
  ]);
}
