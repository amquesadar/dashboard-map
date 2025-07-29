# Dashboard de Bogotá Tour Map

Este proyecto muestra un recorrido en el sur de Bogotá integrado con Google Maps, marcadores de hitos, puntos de interés y paneles de análisis (Chart.js). Se ha modularizado para facilitar mantenimiento y extensión.

---

## Características principales

- Integración con Google Maps mediante carga dinámica de script  
- Trazado de ruta entre dos puntos (Inicio / Fin)  
- Círculos de 4 m de radio alrededor de cada hito  
- Generación aleatoria de personas y POIs (points of interest) dentro del área delimitada  
- Panel de análisis con tres gráficos horizontales:  
  - Distribución socioeconómica (clases A–E)  
  - Distribución por edad (0–17, 18–35, 36–50, 51–65, 66+)  
  - Conteo de Puntos de Interés (Restaurantes, Parques, Museos, Hospitales)  
- Barra de búsqueda de lugares con paneo automático  
- Botones para alternar capas: Lugares, Hitos, Personas, POIs y Analíticas  
- Selector de tipo de mapa (Mapa ↔ Satélite)  
- Zoom in / Zoom out / Recentrar  
- Modularización por componentes y composables

---

## Estructura del proyecto

```text
src/
├── assets/                 
│   └── logos, íconos  
├── components/            
│   ├── AppHeader.vue       # Encabezado con búsqueda y toggle
│   ├── MapSection.vue      # Mapa + controles + toggles  
│   ├── AnalyticsSection.vue# Panel de gráficos Chart.js  
│   ├── Controls.vue        # Botones de zoom/recentrado/tipo de mapa  
│   └── Toggles.vue         # Alterna visibilidad de capas  
├── composables/            
│   ├── useGoogleMaps.ts    # Loader e init de Google Maps  
│   ├── useRouteOverlay.ts  # Ruta, hitos y círculo de mitad de trayecto  
│   ├── useLayerManager.ts  # Gestión de marcadores por capas  
│   ├── useControls.ts      # Funciones de zoom y recentrar  
│   └── useMockData.ts      # Genera datos mock: personas, places, pois  
├── styles/                 
│   └── app.css             # Estilos globales  
├── App.vue                 # Orquestador principal  
└── main.js                 # Bootstrapping de Vue + estilos  
```

# Componentes
AppHeader.vue
Logo, input de búsqueda y sugerencias

Toggle de tipo de mapa

Emite eventos go-to(place) y set-map-type(type)

MapSection.vue
Contenedor del mapa (ref="mapRef")

Uso de composables para inicializar y actualizar overlays

Incorpora <Controls> y <Toggles>

AnalyticsSection.vue
Tres <canvas> para Chart.js

Carga dinámica de la librería Chart.js

Recibe props: personas, clasesSocio, gruposEdad, pois, poiCats

Composables
useGoogleMaps.ts
Función loadGoogleMaps(apiKey) para inyectar el script

Refs: mapRef, map

Método initMap(center, zoom, mapTypeId)

Método setMapType(type)

useRouteOverlay.ts
Calcula routeCoords, milestones[], midpoint, radius

Funciones drawRoute() y drawCircle()

useLayerManager.ts
Gestión de marcadores: addPlaces(), removePlaces(), etc.

Estado reactivo layers (places, milestones, people, pois)

Funciones toggleLayer(layer) y addAll()

useControls.ts
Funciones de control: acercar(), alejar(), recentrar()

Utiliza el ref map y el centro inicial

useMockData.ts
Arrays estáticos: places, clasesSocio, gruposEdad, poiCats

Genera datos aleatorios: personas[] y pois[]

Proceso de modularización
Partir de un App.vue monolítico con toda la lógica y estilos inline.

Extraer estilos a src/styles/app.css.

Separar la cabecera en AppHeader.vue.

Extraer panel de gráficos a AnalyticsSection.vue.

Crear MapSection.vue y componentes auxiliares (Controls.vue, Toggles.vue).

Factorizar lógica de mapas y datos en composables (5 módulos).

Simplificar App.vue para que solo orqueste props y estados globales.
