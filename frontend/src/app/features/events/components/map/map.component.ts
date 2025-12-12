import { Component, AfterViewInit, ChangeDetectionStrategy, input, output, effect, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Event } from '../../../../core/services/event.service';

@Component({
  selector: 'app-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<div id="map" class="h-full w-full z-0"></div>',
  styles: [`
    :host { 
      display: block; 
      height: 100%; 
      width: 100%; 
    }
    #map {
      height: 100%;
      width: 100%;
      background: #0B0E14;
    }
  `]
})
export class MapComponent implements AfterViewInit {
  // Input signals
  events = input.required<Event[]>();
  selectedEvent = input<Event | null>(null);

  // Output signal
  markerClicked = output<Event>();

  private map!: L.Map;
  private markers: Map<number, L.Marker> = new Map();

  constructor(private router: Router, private ngZone: NgZone) {
    // Listen to Global Custom Event for "Ver Detalles"
    window.addEventListener('map-event-detail', (e: any) => {
      this.ngZone.run(() => {
        const eventId = e.detail;
        console.log('Navigating to detail for:', eventId);
        this.router.navigate(['/events', eventId]);
      });
    });

    // Effect para actualizar markers cuando events cambia
    effect(() => {
      const events = this.events();
      if (this.map && events.length > 0) {
        console.log('Events signal changed, updating markers:', events.length);
        this.updateMarkers(events);
      }
    });

    // Effect para flyTo cuando selectedEvent cambia
    effect(() => {
      const selected = this.selectedEvent();
      if (selected && this.map) {
        console.log('Selected event changed, flying to:', selected.title);
        this.flyToEvent(selected);
      }
    });
  }

  ngAfterViewInit(): void {
    // Usar setTimeout para asegurar que el DOM está listo
    setTimeout(() => {
      this.initMap();
    }, 0);
  }

  private initMap(): void {
    console.log('Initializing map...');

    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map element not found!');
      return;
    }

    try {
      this.map = L.map('map', {
        center: [-31.4161, -64.1840], // Córdoba Capital
        zoom: 13,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      console.log('Map initialized successfully');

      // Forzar actualización del tamaño del mapa
      setTimeout(() => {
        this.map.invalidateSize();

        // Update markers si ya hay eventos
        const events = this.events();
        if (events.length > 0) {
          this.updateMarkers(events);
        }
      }, 100);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private updateMarkers(events: Event[]): void {
    console.log('Updating markers:', events.length);

    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers.clear();

    events.forEach(event => {
      if (event.latitude && event.longitude) {
        const marker = L.marker([event.latitude, event.longitude], {
          icon: this.createCustomIcon(event.category)
        })
          .addTo(this.map)
          .bindPopup(`
            <div class="text-gray-900 min-w-[180px] p-1 font-sans">
              <h3 class="font-bold text-base leading-tight">${event.title}</h3>
              <div class="flex items-center gap-2 mt-1">
                 <span class="text-xs font-semibold px-2 py-0.5 bg-gray-200 rounded-full text-gray-700">${event.category}</span>
              </div>
              <p class="text-xs mt-2 text-gray-500">📅 ${new Date(event.date || Date.now()).toLocaleDateString()}</p>
              <button 
                onclick="window.dispatchEvent(new CustomEvent('map-event-detail', { detail: ${event.id} }))"
                class="mt-3 w-full bg-black text-white text-xs font-bold py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-lg">
                VER DETALLES
              </button>
            </div>
          `, { closeButton: false, offset: [0, -20] })
          .on('mouseover', function (this: L.Marker) {
            this.openPopup();
          })
          .on('click', () => {
            // Zoom to location on click?
            this.flyToEvent(event);
            this.markerClicked.emit(event);
          });

        this.markers.set(event.id, marker);
      }
    });

    console.log('Markers added:', this.markers.size);
  }



  private flyToEvent(event: Event): void {
    if (event.latitude && event.longitude) {
      this.map.flyTo([event.latitude, event.longitude], 16, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }

  private createCustomIcon(category: string): L.DivIcon {
    let colorClass = 'bg-blue-500';

    switch (category.toLowerCase()) {
      case 'music': colorClass = 'bg-purple-500'; break;
      case 'food': colorClass = 'bg-orange-500'; break;
      case 'art': colorClass = 'bg-pink-500'; break;
      case 'tech': colorClass = 'bg-green-500'; break;
      case 'party': colorClass = 'bg-red-500'; break;
      case 'nature': colorClass = 'bg-emerald-500'; break;
    }

    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="w-6 h-6 ${colorClass} rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }
}
