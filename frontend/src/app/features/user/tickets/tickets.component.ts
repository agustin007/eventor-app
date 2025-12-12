import { Component, OnInit, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService, Ticket } from '@core/services/ticket.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  private ticketService = inject(TicketService);

  // State signals
  tickets = signal<Ticket[]>([]);
  isLoading = signal(true);

  // Computed - Ticket stats
  ticketStats = computed(() => {
    const all = this.tickets();
    return {
      total: all.length,
      active: all.filter(t => !t.isUsed).length,
      used: all.filter(t => t.isUsed).length
    };
  });

  ngOnInit() {
    console.log('Loading tickets...');
    this.loadTickets();
  }

  loadTickets() {
    this.ticketService.getMyTickets().subscribe({
      next: (data: Ticket[]) => {
        console.log('Tickets loaded:', data);
        this.tickets.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading tickets:', err);
        this.isLoading.set(false);
      }
    });
  }

  // Helper methods
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('es-AR');
  }
}
