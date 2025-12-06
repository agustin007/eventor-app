# 🚀 Plan de Modernización Angular - Signals & Reactivity

**Versión:** 1.0  
**Fecha:** 2025-12-05  
**Objetivo:** Migrar Eventor a Angular moderno con Signals, OnPush y Control Flow

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Angular Signals](#angular-signals)
3. [Input Signals](#input-signals)
4. [Change Detection OnPush](#change-detection-onpush)
5. [Control Flow Syntax](#control-flow-syntax)
6. [Migración Paso a Paso](#migración-paso-a-paso)
7. [Ejemplos de Código](#ejemplos-de-código)

---

## Visión General

### ¿Por qué Angular Signals?

Angular 18 introduce **Signals** como la nueva forma reactiva de manejar estado, reemplazando RxJS en muchos casos comunes y mejorando drásticamente el performance.

**Beneficios:**

```typescript
// ❌ ANTES: RxJS + ChangeDetectorRef
events$ = new BehaviorSubject<Event[]>([]);
ngOnInit() {
  this.eventService.getEvents().subscribe(events => {
    this.events$.next(events);
    this.cdr.markForCheck(); // Manual change detection
  });
}

// ✅ AHORA: Signals (más simple, más rápido)
events = signal<Event[]>([]);
ngOnInit() {
  this.eventService.getEvents().subscribe(events => {
    this.events.set(events);
    // Change detection automático y quirúrgico
  });
}
```

**Performance Gains:**
- ⚡ **3-5x más rápido** en change detection
- 🎯 **Actualizaciones quirúrgicas** (solo componentes afectados)
- 🧠 **Menos memory leaks** (no más subscribe/unsubscribe)
- 📉 **Bundle size menor** (menos dependencia de RxJS)

---

## Angular Signals

### Conceptos Básicos

```typescript
import { signal, computed, effect } from '@angular/core';

// 1. Signal básico (writable)
const count = signal(0);
console.log(count()); // 0 - leer valor
count.set(5);         // setter
count.update(n => n + 1); // updater

// 2. Computed signal (readonly, derivado)
const double = computed(() => count() * 2);
console.log(double()); // 12 - se actualiza automáticamente

// 3. Effect (side effects)
effect(() => {
  console.log('Count changed:', count());
  // Se ejecuta cada vez que count() cambia
});
```

### Migración de RxJS a Signals

```typescript
// ❌ ANTES: BehaviorSubject
private eventsSubject = new BehaviorSubject<Event[]>([]);
events$ = this.eventsSubject.asObservable();

loadEvents() {
  this.eventService.getEvents().subscribe(data => {
    this.eventsSubject.next(data);
  });
}

// En template
<div *ngFor="let event of events$ | async">

// ✅ AHORA: Signal
events = signal<Event[]>([]);

loadEvents() {
  this.eventService.getEvents().subscribe(data => {
    this.events.set(data);
  });
}

// En template (más simple)
@for (event of events(); track event.id) {
  <div>{{ event.title }}</div>
}
```

### toSignal() - Bridge entre RxJS y Signals

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

// Útil cuando NECESITAS mantener Observables (HTTP, etc.)
events = toSignal(this.eventService.getEvents(), {
  initialValue: []
});

// Ahora 'events' es un signal, no un Observable
// Template: {{ events().length }}
```

---

## Input Signals

### Reemplazando @Input() con input()

```typescript
// ❌ ANTES: @Input() tradicional
@Component({
  selector: 'app-event-card'
})
export class EventCardComponent {
  @Input() event!: Event;
  @Input() showPrice = true;
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['event']) {
      console.log('Event changed');
    }
  }
}

// ✅ AHORA: input signal
@Component({
  selector: 'app-event-card'
})
export class EventCardComponent {
  event = input.required<Event>(); // required
  showPrice = input(true); // optional con default
  
  // Computed derivado del input
  eventDate = computed(() => {
    const date = new Date(this.event().date);
    return date.toLocaleDateString();
  });
  
  // Effect para side effects
  constructor() {
    effect(() => {
      console.log('Event changed:', this.event().title);
    });
  }
}

// Template
<div>{{ event().title }}</div>
<div>{{ eventDate() }}</div>
```

### Model Signals (Two-Way Binding)

```typescript
// Para inputs que emiten valores de vuelta (two-way binding)

// ❌ ANTES
@Input() value!: string;
@Output() valueChange = new EventEmitter<string>();

// ✅ AHORA
value = model<string>(''); // two-way binding signal

// Template padre
<app-search [(value)]="searchTerm" />
```

---

## Change Detection OnPush

### Estrategia OnPush con Signals

```typescript
@Component({
  selector: 'app-event-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // ⚡ CRÍTICO
  template: `
    <h2>Events ({{ events().length }})</h2>
    @for (event of events(); track event.id) {
      <app-event-card [event]="event" />
    }
  `
})
export class EventListComponent {
  events = signal<Event[]>([]);
  
  // Con OnPush + Signals:
  // - Solo se actualiza cuando signals cambian
  // - No más change detection en cada click/mousemove
  // - Performance 5x mejor
}
```

**Regla de Oro:** 
- ✅ **SIEMPRE usar `OnPush`** con Signals
- ✅ **Evitar mutations directas** (usar `.set()` o `.update()`)
- ✅ **No más `ChangeDetectorRef.markForCheck()`**

---

## Control Flow Syntax

Angular 18 introduce nueva sintaxis built-in, más legible y performante.

### @if - Reemplaza *ngIf

```typescript
// ❌ ANTES: *ngIf
<div *ngIf="isLoading">Loading...</div>
<div *ngIf="events.length > 0; else noEvents">
  Events loaded
</div>
<ng-template #noEvents>No events</ng-template>

// ✅ AHORA: @if
@if (isLoading()) {
  <div>Loading...</div>
}

@if (events().length > 0) {
  <div>Events loaded</div>
} @else {
  <div>No events</div>
}
```

### @for - Reemplaza *ngFor

```typescript
// ❌ ANTES: *ngFor
<div *ngFor="let event of events; trackBy: trackById">
  {{ event.title }}
</div>

// ✅ AHORA: @for
@for (event of events(); track event.id) {
  <div>{{ event.title }}</div>
} @empty {
  <div>No events available</div>
}
```

**Ventajas:**
- ⚡ **Más rápido** (no crea directivas adicionales)
- 🎯 **Bloque @empty nativo**
- 🔧 **Mejor tracking** (obligatorio)
- 📖 **Más legible**

### @switch - Reemplaza [ngSwitch]

```typescript
// ❌ ANTES: ngSwitch
<div [ngSwitch]="event.category">
  <span *ngSwitchCase="'Music'">🎵</span>
  <span *ngSwitchCase="'Food'">🍕</span>
  <span *ngSwitchDefault>📅</span>
</div>

// ✅ AHORA: @switch
@switch (event().category) {
  @case ('Music') { <span>🎵</span> }
  @case ('Food') { <span>🍕</span> }
  @default { <span>📅</span> }
}
```

---

## Migración Paso a Paso

### Fase 1: Setup (1 día)

```bash
# Actualizar Angular a 18+ (si es necesario)
ng update @angular/core @angular/cli

# Verificar versión
ng version
# Debe ser 18.x o superior
```

### Fase 2: Migrar Componentes (Prioridad)

**Orden recomendado:**

1. **Componentes hoja primero** (sin hijos)
   - `EventCardComponent`
   - `LoaderComponent`
   - `ButtonComponent`

2. **Componentes intermedios**
   - `CarouselComponent`
   - `MapComponent`

3. **Componentes contenedor** (último)
   - `DiscoverComponent`
   - `HomeComponent`

### Fase 3: Patrón de Migración

```typescript
// PASO 1: Agregar changeDetection: OnPush
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// PASO 2: Convertir @Input() a input()
// ANTES
@Input() events!: Event[];

// AHORA
events = input.required<Event[]>();

// PASO 3: Convertir state interno a signals
// ANTES
isLoading = false;

// AHORA
isLoading = signal(false);

// PASO 4: Actualizar template
// ANTES
<div *ngIf="isLoading">Loading</div>

// AHORA
@if (isLoading()) {
  <div>Loading</div>
}
```

---

## Ejemplos de Código

### Ejemplo 1: EventService con toSignal

```typescript
// event.service.ts
@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5256/api/events';
  
  getEvents(category?: string) {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    
    return this.http.get<Event[]>(this.apiUrl, { params });
  }
}
```

### Ejemplo 2: DiscoverComponent Modernizado

```typescript
// discover.component.ts
import { Component, signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-discover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MapComponent, CarouselComponent],
  template: `
    <div class="relative h-screen w-full">
      <!-- Filter Chips -->
      <div class="filters">
        @for (cat of categories; track cat) {
          <button 
            (click)="selectCategory(cat)"
            [class.active]="selectedCategory() === cat">
            {{ cat }}
          </button>
        }
      </div>

      <!-- Map -->
      <app-map 
        [events]="filteredEvents()" 
        [selectedEvent]="selectedEvent()" />

      <!-- Carousel -->
      <app-carousel 
        [events]="filteredEvents()"
        (eventSelected)="selectedEvent.set($event)" />
      
      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loader">Loading...</div>
      }
    </div>
  `
})
export class DiscoverComponent {
  private eventService = inject(EventService);
  
  // State
  selectedCategory = signal<string | null>(null);
  selectedEvent = signal<Event | null>(null);
  isLoading = signal(true);
  
  // Data
  allEvents = signal<Event[]>([]);
  
  // Computed (auto-actualiza cuando cambian sus dependencias)
  filteredEvents = computed(() => {
    const category = this.selectedCategory();
    const all = this.allEvents();
    
    if (!category) return all;
    return all.filter(e => e.category === category);
  });
  
  categories = ['Music', 'Food', 'Art', 'Tech', 'Party', 'Nature'];
  
  constructor() {
    // Effect para logging (útil para debugging)
    effect(() => {
      console.log('Filtered events:', this.filteredEvents().length);
    });
    
    this.loadEvents();
  }
  
  loadEvents() {
    this.isLoading.set(true);
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.allEvents.set(events);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }
  
  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }
}
```

### Ejemplo 3: MapComponent con Input Signals

```typescript
// map.component.ts
@Component({
  selector: 'app-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<div id="map" class="h-full w-full"></div>'
})
export class MapComponent implements AfterViewInit {
  // Input signals
  events = input.required<Event[]>();
  selectedEvent = input<Event | null>(null);
  
  // Output
  markerClicked = output<Event>(); // nuevo API de outputs
  
  private map!: L.Map;
  private markers = new Map<number, L.Marker>();
  
  constructor() {
    // Effect cuando events cambian
    effect(() => {
      const events = this.events();
      if (this.map && events.length > 0) {
        this.updateMarkers(events);
      }
    });
    
    // Effect cuando selectedEvent cambia
    effect(() => {
      const selected = this.selectedEvent();
      if (selected && this.map) {
        this.flyToEvent(selected);
      }
    });
  }
  
  ngAfterViewInit() {
    this.initMap();
  }
  
  private initMap() {
    this.map = L.map('map', {
      center: [-31.4161, -64.1840],
      zoom: 13
    });
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png')
      .addTo(this.map);
  }
  
  private updateMarkers(events: Event[]) {
    // Clear old markers
    this.markers.forEach(m => m.remove());
    this.markers.clear();
    
    // Add new markers
    events.forEach(event => {
      const marker = L.marker([event.latitude, event.longitude])
        .addTo(this.map)
        .on('click', () => this.markerClicked.emit(event));
      
      this.markers.set(event.id, marker);
    });
  }
  
  private flyToEvent(event: Event) {
    this.map.flyTo([event.latitude, event.longitude], 16);
  }
}
```

### Ejemplo 4: CarouselComponent

```typescript
// carousel.component.ts
@Component({
  selector: 'app-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="carousel">
      @for (event of events(); track event.id) {
        <div class="card" (click)="selectEvent(event)">
          <img [src]="event.imageUrl" [alt]="event.title">
          <h3>{{ event.title }}</h3>
          <p>{{ formatDate(event.date) }}</p>
          
          @switch (event.category) {
            @case ('Music') { <span>🎵</span> }
            @case ('Food') { <span>🍕</span> }
            @case ('Art') { <span>🎨</span> }
            @default { <span>📅</span> }
          }
        </div>
      } @empty {
        <div class="no-events">No events found</div>
      }
    </div>
  `
})
export class CarouselComponent {
  events = input.required<Event[]>();
  eventSelected = output<Event>();
  
  selectEvent(event: Event) {
    this.eventSelected.emit(event);
  }
  
  formatDate(date: Date) {
    return new Date(date).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short'
    });
  }
}
```

---

## Checklist de Migración

```markdown
### Por Componente

- [ ] Agregar `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] Convertir `@Input()` a `input()` o `input.required()`
- [ ] Convertir `@Output()` a `output()`
- [ ] Convertir propiedades reactivas a `signal()`
- [ ] Crear `computed()` para valores derivados
- [ ] Reemplazar `*ngIf` con `@if`
- [ ] Reemplazar `*ngFor` con `@for`
- [ ] Reemplazar `*ngSwitch` con `@switch`
- [ ] Eliminar `ngOnChanges` (usar `effect()` si es necesario)
- [ ] Eliminar `ChangeDetectorRef` imports
- [ ] Probar que funcione correctamente

### Verificación de Performance

- [ ] Usar Chrome DevTools Performance
- [ ] Verificar que change detection solo corre cuando signals cambian
- [ ] Comprobar que no hay memory leaks (ngOnDestroy no necesario para signals)
```

---

## Consideraciones Importantes

### ✅ DO's

```typescript
// ✅ Usar .set() para actualizar signals
count.set(5);

// ✅ Usar .update() para transformaciones
count.update(n => n + 1);

// ✅ Derived state con computed
const double = computed(() => count() * 2);

// ✅ Side effects con effect
effect(() => console.log(count()));
```

### ❌ DON'Ts

```typescript
// ❌ NO mutar directamente
const events = signal([]);
events().push(newEvent); // MAL!

// ✅ Usar update con inmutabilidad
events.update(arr => [...arr, newEvent]);

// ❌ NO usar signals fuera de reactive context sin ()
console.log(count); // MAL! retorna signal object

// ✅ Llamar como función
console.log(count()); // BIEN!
```

---

## Recursos

- [Angular Signals Docs](https://angular.dev/guide/signals)
- [Angular Control Flow](https://angular.dev/guide/templates/control-flow)
- [Change Detection Best Practices](https://angular.dev/best-practices/runtime-performance)

---

**Próximo paso:** Continuar con `free-tools-stack.md`
