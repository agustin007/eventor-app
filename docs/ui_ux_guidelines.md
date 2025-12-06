# Guías de UI/UX y Criterios de Diseño - Eventor

## 1. Principios de Diseño
*   **"Wow" Effect:** La primera impresión debe ser impactante. Uso de imágenes de alta calidad, contrastes fuertes y micro-interacciones.
*   **Inmersión:** La interfaz debe sentirse "viva". Uso de Glassmorphism (transparencias, desenfoques) para dar profundidad y contexto.
*   **Claridad:** A pesar de la riqueza visual, la información clave (Qué, Cuándo, Dónde, Cuánto) debe ser legible instantáneamente.
*   **Dark Mode First:** La identidad de la marca es nocturna y neón. El modo oscuro es el predeterminado y principal.

## 2. Sistema de Diseño (Design System)
### Colores
*   **Primary (Fondo):** `#0B0E14` (Negro profundo, casi azulado).
*   **Surface (Tarjetas/Paneles):** `#1F2937` con opacidad (Glassmorphism).
*   **Accent (Primario):** `#6366F1` (Indigo Neón) - Para acciones principales (CTAs).
*   **Secondary (Destacados):** `#F43F5E` (Rose Neón) - Para notificaciones o favoritos.
*   **Text:** `#F3F4F6` (Blanco hueso) para lectura cómoda.

### Tipografía
*   **Familia:** `Inter` (Google Fonts).
*   **H1 (Títulos):** Bold, Tracking tight.
*   **Body:** Regular, buena altura de línea para legibilidad.

### Componentes Clave
*   **Tarjetas (Cards):** Bordes redondeados (`rounded-xl`), borde sutil (`border-white/10`), fondo con blur (`backdrop-blur-md`). Efecto hover con brillo (`border-accent/50`).
*   **Botones:** Gradientes sutiles, sombras de color (`shadow-accent/25`). Feedback táctil al click.
*   **Mapa:** Estilo personalizado "Dark Matter" (sin colores distractores, solo calles oscuras y pines brillantes).

## 3. Criterios de UX por Pantalla
### Home (Landing)
*   **Objetivo:** Inspirar y dirigir.
*   **Criterio:** El usuario debe entender la propuesta de valor en 3 segundos. Hero section con video/imagen potente. Accesos directos claros a "Mapa" y "Categorías".

### Mapa (Discover)
*   **Objetivo:** Exploración geográfica.
*   **Criterio:** No abrumar con pines. Agrupar (clustering) si hay muchos. El panel inferior (carrusel) es vital para navegar sin tocar el mapa. Transiciones suaves de cámara (flyTo).

### Detalle de Evento
*   **Objetivo:** Conversión (Asistir).
*   **Criterio:** Botón de acción (Comprar/Asistir) siempre visible (sticky). Información jerarquizada: 1. Foto/Video, 2. Título/Fecha, 3. Ubicación, 4. Descripción.

### Dashboard B2B
*   **Objetivo:** Gestión eficiente.
*   **Criterio:** Priorizar la visualización de datos (Gráficos simples). Tablas limpias con acciones rápidas.

## 4. Referencias Visuales (Mockup Descriptions)
*Debido a limitaciones técnicas momentáneas para generar renders, describimos los layouts clave:*

### A. Discovery Map (Pantalla Principal)
*   **Layout:** Full-screen map (Dark Mode).
*   **Top Bar:** Barra de búsqueda flotante con efecto glassmorphism. Debajo, chips de filtros horizontales (Music, Food, Art) en colores neón inactivos (gris) y activos (blanco/accent).
*   **Bottom:** Carrusel de tarjetas de eventos. Cada tarjeta ocupa el 85% del ancho, permitiendo ver la siguiente. Fondo semi-transparente, foto del evento a sangre en la mitad superior, título y detalles en blanco sobre fondo oscuro blurreado.
*   **Interacción:** Al hacer swipe en las tarjetas, el mapa hace "flyTo" al pin correspondiente.

### B. Event Detail (Modal/Page)
*   **Header:** Hero Image (Video/Foto) ocupando el 40% superior. Gradiente de negro a transparente en la base de la imagen.
*   **Info Body:** Título H1 grande (32px) en blanco. Debajo, fila de iconos: [Calendario] Fecha, [Pin] Ubicación, [Ticket] Precio.
*   **Sticky Footer:** Barra fija en la parte inferior con fondo negro/blur. Botón "Comprar Ticket" ocupando el ancho total, gradiente Indigo-Rose, sombra resplandeciente.

### C. User Dashboard
*   **Header:** Avatar circular con borde gradiente (indicando nivel). Nombre de usuario y badge "Nivel 5". Barra de progreso de XP fina debajo.
*   **Grid:** Lista de tickets activos. Diseño tipo "Boarding Pass": Izquierda info del evento, Derecha código QR (simulado) sobre fondo blanco para contraste.
*   **Settings:** Lista de opciones con iconos a la izquierda y chevrons (>) a la derecha. Estilo iOS Settings pero en Dark Mode.

