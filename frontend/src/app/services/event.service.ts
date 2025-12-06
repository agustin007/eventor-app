import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  price: number;
  latitude: number;
  longitude: number;
  imageUrl: string;
  category: string;
  organizerId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.events}`;

  // Cache signals
  private eventsCache = signal<Event[]>([]);
  private lastFetchTime = signal<number>(0);
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  getEvents(category?: string): Observable<Event[]> {
    // Check cache validity
    const now = Date.now();
    const isCacheValid = (now - this.lastFetchTime()) < this.CACHE_DURATION;
    const hasData = this.eventsCache().length > 0;

    // Si hay caché válido y no hay filtro de categoría (o el filtro se puede aplicar en cliente), usamos caché
    // Nota: Para simplificar, si hay filtro pedimos al backend, pero podríamos filtrar en cliente si tenemos todos los eventos.
    // Vamos a asumir que getEvents() sin params trae todo y cacheamos eso.

    if (isCacheValid && hasData && !category) {
      console.log('Returning cached events');
      return of(this.eventsCache());
    }

    if (isCacheValid && hasData && category) {
      console.log('Returning cached events filtered by category');
      const filtered = this.eventsCache().filter(e => e.category === category);
      if (filtered.length > 0) return of(filtered);
      // Si no hay en caché, tal vez necesitamos fetchear de nuevo por si hay nuevos
    }

    // Fetch fresh data
    let params = new HttpParams();
    if (category) params = params.set('category', category);

    return this.http.get<Event[]>(this.apiUrl, { params }).pipe(
      tap(events => {
        // Solo actualizamos el caché principal si pedimos TODOS los eventos (sin filtro)
        if (!category) {
          console.log('Updating events cache');
          this.eventsCache.set(events);
          this.lastFetchTime.set(now);
        }
      })
    );
  }

  getEventById(id: number): Observable<Event> {
    // Primero buscamos en caché
    const cachedEvent = this.eventsCache().find(e => e.id === id);
    if (cachedEvent) {
      console.log('Returning cached event details');
      return of(cachedEvent);
    }

    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  invalidateCache() {
    this.lastFetchTime.set(0);
    this.eventsCache.set([]);
  }
}
