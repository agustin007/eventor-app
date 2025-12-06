# Epicas e Historias de Usuario - Eventor (Detallado)

## Módulo A: Authentication & Onboarding
**Objetivo:** Capturar al usuario con la menor fricción posible y personalizar su experiencia inicial.

### Epica A1: Registro e Inicio de Sesión
*   **US-A1.1: Social Login (Google/Apple)**
    *   *Como* nuevo usuario,
    *   *Quiero* registrarme con un solo click usando mi cuenta de Google o Apple,
    *   *Para* no tener que recordar otra contraseña.
    *   *Mockup Ref:* `mockup_login_screen`

*   **US-A1.2: Onboarding de Intereses (AI Vibe Check)**
    *   *Como* nuevo usuario,
    *   *Quiero* seleccionar mis intereses (Música, Arte, Comida) o "vibras" (Chill, Party, Date),
    *   *Para* que la app me recomiende eventos relevantes desde el segundo cero.
    *   *Mockup Ref:* `mockup_onboarding_interests`

## Módulo B: Discovery (Mapa y Listado)
**Objetivo:** Permitir la exploración fluida y el descubrimiento serendipitoso.

### Epica B1: Mapa Interactivo (Core)
*   **US-B1.1: Visualización de Pines por Categoría**
    *   *Como* explorador,
    *   *Quiero* ver pines diferenciados por color/icono en el mapa oscuro,
    *   *Para* identificar rápidamente si es un bar (copa) o un concierto (nota musical).
    *   *Mockup Ref:* `mockup_discovery_map`

*   **US-B1.2: Carrusel "Quick View"**
    *   *Como* usuario navegando el mapa,
    *   *Quiero* deslizar tarjetas en la parte inferior de la pantalla que muevan el mapa al evento correspondiente,
    *   *Para* explorar sin tener que tocar pines pequeños.
    *   *Mockup Ref:* `mockup_discovery_map`

### Epica B2: Búsqueda y Filtros Inteligentes
*   **US-B2.1: Filtros Dinámicos (Chips)**
    *   *Como* usuario con un plan específico,
    *   *Quiero* filtrar por "Hoy", "Mañana", "Gratis" o "Cerca de mí" usando chips rápidos en el tope de la pantalla,
    *   *Para* acotar la búsqueda en segundos.

## Módulo C: Event Details & Interaction
**Objetivo:** Convertir el interés en intención de compra/asistencia.

### Epica C1: Ficha de Evento Inmersiva
*   **US-C1.1: Hero Media Header**
    *   *Como* usuario interesado,
    *   *Quiero* ver un video corto o imagen de alta calidad al abrir el evento,
    *   *Para* sentir la atmósfera del lugar.
    *   *Mockup Ref:* `mockup_event_detail`

*   **US-C1.2: Sticky Action Bar**
    *   *Como* usuario decidido,
    *   *Quiero* tener el botón de "Comprar Ticket" o "Asistir" siempre visible al hacer scroll,
    *   *Para* poder accionar en cualquier momento.
    *   *Mockup Ref:* `mockup_event_detail`

*   **US-C1.3: Social Proof (Reseñas)**
    *   *Como* usuario indeciso,
    *   *Quiero* ver la calificación y comentarios de otros usuarios,
    *   *Para* validar la calidad del evento.

## Módulo D: Checkout & Tickets
**Objetivo:** Proceso de compra seguro y gestión de accesos.

### Epica D1: Gestión de Tickets
*   **US-D1.1: QR Ticket Wallet**
    *   *Como* asistente,
    *   *Quiero* acceder a mis tickets QR incluso sin conexión a internet,
    *   *Para* ingresar al evento rápidamente.
    *   *Mockup Ref:* `mockup_user_dashboard`

## Módulo E: User Profile & Gamification
**Objetivo:** Retención y lealtad.

### Epica E1: Identidad y Progreso
*   **US-E1.1: Nivel de Explorador**
    *   *Como* usuario frecuente,
    *   *Quiero* ver una barra de progreso y mi nivel actual (ej. "Nivel 5"),
    *   *Para* sentirme recompensado por salir.
    *   *Mockup Ref:* `mockup_user_dashboard`

## Módulo F: B2B Organizer Dashboard
**Objetivo:** Proveer valor a los creadores de eventos.

### Epica F1: Analytics & Management
*   **US-F1.1: Resumen de Rendimiento**
    *   *Como* organizador,
    *   *Quiero* ver gráficos de líneas con mis ventas y vistas diarias,
    *   *Para* entender el impacto de mis eventos.
    *   *Mockup Ref:* `mockup_b2b_dashboard`
