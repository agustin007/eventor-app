import { Component, OnInit, ChangeDetectionStrategy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { EventService, Event } from '../../services/event.service';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);

  // Convert route params to signal
  eventId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id'))
    )
  );

  // State signals
  event = signal<Event | null>(null);
  isLoading = signal(true);
  isPurchasing = signal(false);
  error = signal<string | null>(null);

  // Computed - formatted date
  formattedDate = computed(() => {
    const ev = this.event();
    if (!ev) return '';

    const date = new Date(ev.date);
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  // Computed - formatted price
  formattedPrice = computed(() => {
    const ev = this.event();
    if (!ev) return '';
    return ev.price === 0 ? 'Gratis' : '$' + ev.price.toLocaleString('es-AR');
  });

  constructor() {
    // Effect para cargar evento cuando cambia el ID
    effect(() => {
      const id = this.eventId();
      if (id) {
        this.loadEvent(+id);
      }
    });
  }

  ngOnInit() {
    // El effect ya maneja la carga inicial
  }

  loadEvent(id: number) {
    this.isLoading.set(true);
    this.error.set(null);

    this.eventService.getEventById(id).subscribe({
      next: (data) => {
        console.log('Event loaded:', data);
        this.event.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading event:', err);
        this.error.set('No se pudo cargar el evento. Intenta nuevamente.');
        this.isLoading.set(false);
      }
    });
  }

  buyTicket() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    const ev = this.event();
    if (!ev) return;

    this.isPurchasing.set(true);

    this.ticketService.purchaseTicket(ev.id).subscribe({
      next: (response) => {
        alert('¡Ticket comprado exitosamente! Revisa \"Mis Tickets\" para ver tu QR.');
        this.isPurchasing.set(false);
        this.router.navigate(['/tickets']);
      },
      error: (err) => {
        console.error('Error purchasing ticket:', err);
        alert('Error al comprar el ticket. Por favor intenta de nuevo.');
        this.isPurchasing.set(false);
      }
    });
  }
}
