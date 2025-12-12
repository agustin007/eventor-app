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
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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
