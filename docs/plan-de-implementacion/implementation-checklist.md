# ✅ Plan de Implementación - Checklist Ejecutable

**Versión:** 1.0  
**Fecha:** 2025-12-05  
**Duración Estimada:** 2-3 semanas  

---

## 📊 Fases de Implementación

### **FASE 1: Preparación (Días 1-2)**

#### Día 1: Setup del Proyecto

- [ ] **Actualizar Angular a 18+**
  ```bash
  ng update @angular/core@18 @angular/cli@18 --force
  npm install
  ```

- [ ] **Verificar versiones**
  ```bash
  ng version
  # Angular CLI: 18.x
  # Angular: 18.x
  ```

- [ ] **Instalar dependencias adicionales**
  ```bash
  # Vitest para testing más rápido
  npm install -D vitest @vitest/ui
  
  # Playwright para E2E
  npm init playwright@latest
  ```

- [ ] **Configurar TailwindCSS v4 (opcional)**
  ```bash
  npm install -D tailwindcss@next @tailwindcss/postcss@next
  ```

---

#### Día 2: Configuración de Herramientas

- [ ] **Setup Sentry**
  ```bash
  npm install @sentry/angular
  ```
  - Crear cuenta en sentry.io
  - Obtener DSN
  - Configurar en `main.ts`

- [ ] **Setup Vercel**
  ```bash
  npm i -g vercel
  vercel login
  vercel link
  ```

- [ ] **Crear vercel.json**
  ```json
  {
    "buildCommand": "npm run build",
    "outputDirectory": "dist/frontend/browser",
    "framework": "angular"
  }
  ```

- [ ] **Setup GitHub Actions**
  - Crear `.github/workflows/ci.yml`
  - Agregar secrets en GitHub

---

### **FASE 2: Migración de Componentes (Días 3-10)**

#### Prioridad 1: Componentes Simples (Días 3-4)

##### **Componente: LoaderComponent**

- [ ] Crear el componente
  ```bash
  ng g c shared/components/loader
  ```

- [ ] Implementar con signals
  ```typescript
  @Component({
    selector: 'app-loader',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
      @if (show()) {
        <div class="loader">
          <div class="spinner"></div>
          @if (message()) {
            <p>{{ message() }}</p>
          }
        </div>
      }
    `
  })
  export class LoaderComponent {
    show = input(true);
    message = input<string>();
  }
  ```

- [ ] Agregar estilos

- [ ] Probar el componente

---

##### **Componente: EventCardComponent**

- [ ] Migrar a input signals
  ```typescript
  @Component({
    selector: 'app-event-card',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterLink],
    template: `
      <div class="event-card" [routerLink]="['/events', event().id]">
        <img [src]="event().imageUrl" [alt]="event().title">
        
        <div class="content">
          <h3>{{ event().title }}</h3>
          <p class="date">{{ formattedDate() }}</p>
          <p class="location">{{ event().location }}</p>
          
          @if (event().price === 0) {
            <span class="badge free">Gratis</span>
          } @else {
            <span class="badge price">{{ event().price | currency }}</span>
          }
        </div>
      </div>
    `
  })
  export class EventCardComponent {
    event = input.required<Event>();
    
    formattedDate = computed(() => {
      const date = new Date(this.event().date);
      return date.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    });
  }
  ```

- [ ] Actualizar estilos

- [ ] Probar navegación

---

#### Prioridad 2: Componentes Intermedios (Días 5-7)

##### **Componente: CarouselComponent**

- [ ] Migrar template a @for
  ```typescript
  @Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
      <div class="carousel">
        @for (event of events(); track event.id) {
          <app-event-card 
            [event]="event"
            (click)="handleClick(event)" />
        } @empty {
          <div class="empty">No events available</div>
        }
      </div>
    `
  })
  export class CarouselComponent {
    events = input.required<Event[]>();
    eventSelected = output<Event>();
    
    handleClick(event: Event) {
      this.eventSelected.emit(event);
    }
  }
  ```

- [ ] Ajustar estilos

- [ ] Probar scroll y emisión de eventos

---

##### **Componente: MapComponent**

- [ ] Migrar a input signals
- [ ] Usar effects para actualizar mapa
  ```typescript
  @Component({
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class MapComponent implements AfterViewInit {
    events = input.required<Event[]>();
    selectedEvent = input<Event | null>(null);
    markerClicked = output<Event>();
    
    private map!: L.Map;
    private markers = new Map<number, L.Marker>();
    
    constructor() {
      // Effect para actualizar markers
      effect(() => {
        const events = this.events();
        if (this.map && events.length > 0) {
          this.updateMarkers(events);
        }
      });
      
      // Effect para flyTo
      effect(() => {
        const selected = this.selectedEvent();
        if (selected && this.map) {
          this.flyToEvent(selected);
        }
      });
    }
    
    ngAfterViewInit() {
      setTimeout(() => this.initMap(), 0);
    }
    
    // ... resto del código
  }
  ```

- [ ] Probar zoom y markers

---

#### Prioridad 3: Componentes Contenedor (Días 8-10)

##### **Componente: DiscoverComponent**

- [ ] Migrar todo el state a signals
  ```typescript
  export class DiscoverComponent {
    private eventService = inject(EventService);
    
    // State
    allEvents = signal<Event[]>([]);
    selectedCategory = signal<string | null>(null);
    selectedEvent = signal<Event | null>(null);
    isLoading = signal(false);
    
    // Computed
    filteredEvents = computed(() => {
      const category = this.selectedCategory();
      const all = this.allEvents();
      return category 
        ? all.filter(e => e.category === category)
        : all;
    });
    
    categories = ['Music', 'Food', 'Art', 'Tech', 'Party', 'Nature'];
    
    constructor() {
      effect(() => {
        console.log('Showing events:', this.filteredEvents().length);
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
    
    selectCategory(cat: string | null) {
      this.selectedCategory.set(cat);
    }
    
    onEventSelected(event: Event) {
      this.selectedEvent.set(event);
    }
  }
  ```

- [ ] Actualizar template con @if/@for
- [ ] Probar filtros

---

##### **Componente: EventDetailComponent**

- [ ] Usar `toSignal()` para route params
  ```typescript
  export class EventDetailComponent {
    private route = inject(ActivatedRoute);
    private eventService = inject(EventService);
    
    // Convertir route params a signal
    eventId = toSignal(
      this.route.paramMap.pipe(map(params => params.get('id')))
    );
    
    event = signal<Event | null>(null);
    isLoading = signal(true);
    
    constructor() {
      effect(() => {
        const id = this.eventId();
        if (id) {
          this.loadEvent(+id);
        }
      });
    }
    
    loadEvent(id: number) {
      this.isLoading.set(true);
      this.eventService.getEventById(id).subscribe({
        next: (event) => {
          this.event.set(event);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }
  ```

- [ ] Actualizar template
- [ ] Probar navegación

---

##### **Componente: TicketsComponent**

- [ ] Migrar a signals
  ```typescript
  export class TicketsComponent {
    private ticketService = inject(TicketService);
    
    tickets = signal<Ticket[]>([]);
    isLoading = signal(true);
    
    constructor() {
      this.loadTickets();
    }
    
    loadTickets() {
      this.ticketService.getMyTickets().subscribe({
        next: (tickets) => {
          this.tickets.set(tickets);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }
  ```

- [ ] Actualizar template con @for
- [ ] Probar carga de tickets

---

### **FASE 3: Services (Días 11-12)**

#### EventService

- [ ] Añadir caché con signals
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class EventService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5256/api/events';
    
    // Cache
    private cache = signal<Event[]>([]);
    private lastFetch = signal<number>(0);
    private CACHE_DURATION = 5 * 60 * 1000; // 5 min
    
    getEvents(category?: string): Observable<Event[]> {
      // Check cache
      const now = Date.now();
      if (now - this.lastFetch() < this.CACHE_DURATION && !category) {
        return of(this.cache());
      }
      
      // Fetch fresh data
      let params = new HttpParams();
      if (category) params = params.set('category', category);
      
      return this.http.get<Event[]>(this.apiUrl, { params }).pipe(
        tap(events => {
          if (!category) {
            this.cache.set(events);
            this.lastFetch.set(now);
          }
        })
      );
    }
    
    // Clear cache
    invalidateCache() {
      this.lastFetch.set(0);
    }
  }
  ```

- [ ] Probar caché

---

#### AuthService

- [ ] Migrar user state a signal
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class AuthService {
    private router = inject(Router);
    private http = inject(HttpClient);
    
    // State
    currentUser = signal<User | null>(null);
    isAuthenticated = computed(() => this.currentUser() !== null);
    
    constructor() {
      // Load user from localStorage on init
      const token = localStorage.getItem('token');
      if (token) {
        this.loadUserFromToken(token);
      }
    }
    
    login(credentials: LoginRequest): Observable<LoginResponse> {
      return this.http.post<LoginResponse>('/api/auth/login', credentials)
        .pipe(
          tap(response => {
            localStorage.setItem('token', response.token);
            this.currentUser.set(response.user);
          })
        );
    }
    
    logout() {
      localStorage.removeItem('token');
      this.currentUser.set(null);
      this.router.navigate(['/login']);
    }
  }
  ```

- [ ] Actualizar guards
- [ ] Probar login/logout

---

### **FASE 4: Testing (Días 13-15)**

#### Unit Tests

- [ ] Configurar Vitest
  ```typescript
  // vitest.config.ts
  import { defineConfig } from 'vitest/config';
  
  export default defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html']
      }
    }
  });
  ```

- [ ] Escribir tests para signals
  ```typescript
  // event-service.spec.ts
  import { describe, it, expect } from 'vitest';
  
  describe('EventService', () => {
    it('should cache events', () => {
      const service = new EventService(http);
      
      service.getEvents().subscribe();
      const cached = service['cache']();
      
      expect(cached.length).toBeGreaterThan(0);
    });
  });
  ```

- [ ] Coverage >80%

---

#### E2E Tests

- [ ] Escribir tests con Playwright
  ```typescript
  // tests/discover.spec.ts
  import { test, expect } from '@playwright/test';
  
  test('can filter events by category', async ({ page }) => {
    await page.goto('/discover');
    
    await page.click('button:has-text("Music")');
    
    const events = page.locator('.event-card');
    await expect(events.first()).toBeVisible();
    
    const category = await events.first().locator('.badge').textContent();
    expect(category).toContain('Music');
  });
  ```

- [ ] Ejecutar tests
  ```bash
  npx playwright test
  ```

---

### **FASE 5: Deploy (Días 16-18)**

#### Frontend

- [ ] Deploy a Vercel
  ```bash
  vercel --prod
  ```

- [ ] Verificar en https://eventor.vercel.app

- [ ] Configurar dominio custom (opcional)

---

#### Backend

- [ ] Migrar DB a Supabase
  ```bash
  # Export SQL Server
  # Import a Supabase
  ```

- [ ] Deploy a Render
  - Crear cuenta en render.com
  - Conectar GitHub repo
  - Configurar environment variables
  - Deploy

- [ ] Verificar health endpoint

---

#### CI/CD

- [ ] Verificar GitHub Actions
  ```bash
  git push origin main
  # Watch pipeline
  ```

- [ ] Verificar auto-deploy

---

### **FASE 6: Monitoreo (Días 19-21)**

#### Sentry

- [ ] Verificar errores en Sentry dashboard

- [ ] Crear alertas
  - Error rate >1%
  - P99 latency >2s

---

#### Performance

- [ ] Lighthouse audit
  - Performance >90
  - Accessibility >90
  - Best Practices >90
  - SEO >90

- [ ] Verificar que change detection solo corre cuando signals cambian

---

## 📋 Checklist Global

### Código

- [ ] Todos los componentes usan `OnPush`
- [ ] No quedan `@Input()`, solo `input()`
- [ ] No quedan `@Output()`, solo `output()`
- [ ] No quedan `*ngIf`, solo `@if`
- [ ] No quedan `*ngFor`, solo `@for`
- [ ] No quedan `BehaviorSubject`, solo `signal()`
- [ ] No quedan `ngOnChanges`, solo `effect()`
- [ ] Coverage >80%

### Infraestructura

- [ ] Frontend deployed a Vercel
- [ ] Backend deployed a Render
- [ ] DB migrada a Supabase
- [ ] CI/CD funcionando
- [ ] Sentry configurado
- [ ] Logs funcionando

### Documentación

- [ ] README actualizado
- [ ] Docs de migración
- [ ] Guías de deploy

---

## 🎯 Criterios de Éxito

```yaml
Performance:
  - First Contentful Paint: <1.5s
  - Time to Interactive: <3s
  - Change Detection: Solo en signals mutados
  - Bundle size: <500KB (gzipped)

Code Quality:
  - Coverage: >80%
  - Lint errors: 0
  - Type errors: 0
  - Security issues: 0 (high/critical)

User Experience:
  - Lighthouse Performance: >90
  - Error rate: <0.1%
  - Uptime: >99%
```

---

## 🚩 Red Flags (Detener y revisar)

- ❌ Performance score <70
- ❌ Critical security vulnerabilities
- ❌ E2E tests failing
- ❌ Production errors >10/día
- ❌ Build time >5 min
- ❌ Cold start time >3s

---

## 📞 Soporte

Si te atascas:
1. Revisa `angular-modernization-plan.md`
2. Consulta la documentación oficial de Angular
3. Busca en StackOverflow
4. Pregunta en Discord de Angular

---

**¡Listo para comenzar!** 🚀
