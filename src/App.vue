<template>
  <div class="app">
    <!-- Extracted Header -->
    <AppHeader
      :places="places"
      :mapType="mapType"
      @go-to="irAlugar"
      @set-map-type="setMapType"
    />

    <!-- Main Content -->
    <main class="content">
      <!-- Map Section -->
      <section class="map-section">
        <div ref="mapRef" class="map-container"></div>

        <div class="controls">
          <button @click="acercar">＋</button>
          <button @click="alejar">－</button>
          <button @click="recentrar">Recentrar</button>
        </div>

        <div class="toggles">
          <button @click="toggle('places')">
            {{ showPlaces ? 'Ocultar' : 'Mostrar' }} Lugares
          </button>
          <button @click="toggle('milestones')">
            {{ showMilestones ? 'Ocultar' : 'Mostrar' }} Hitos
          </button>
          <button @click="toggle('people')">
            {{ showPeople ? 'Ocultar' : 'Mostrar' }} Personas
          </button>
          <button @click="toggle('analytics')">
            {{ showAnalytics ? 'Ocultar' : 'Mostrar' }} Analíticas
          </button>
        </div>
      </section>

      <!-- Extracted Analytics -->
      <AnalyticsSection
        v-if="showAnalytics"
        :personas="personas"
        :clasesSocio="clasesSocio"
        :gruposEdad="gruposEdad"
        :pois="pois"
        :poiCats="poiCats"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AnalyticsSection from '@/components/AnalyticsSection.vue'

// --- API & Refs ---
const API_KEY = 'AIzaSyBhJuYMTTTbvD8Ly88gSZ66HsMWfvzmONk'
const mapRef  = ref(null)
const map     = ref(null)

// --- UI State ---
const showPlaces     = ref(true)
const showMilestones = ref(true)
const showPeople     = ref(true)
const showAnalytics  = ref(true)
const mapType        = ref('roadmap')

// --- PLACES (start/end) ---
const places = [
  { id: 'start', label: 'Inicio de Ruta',
    coords: { lat: 4.5726604, lng: -74.0914428 }, color: 'red' },
  { id: 'end',   label: 'Fin de Ruta',
    coords: { lat: 4.5769169, lng: -74.0884495 }, color: 'black' }
]

// --- ROUTE & MILESTONES ---
function interp(a, b, f) {
  return {
    lat: a.lat + (b.lat - a.lat) * f,
    lng: a.lng + (b.lng - a.lng) * f
  }
}
function dist(a, b) {
  const toRad = d => d * Math.PI/180
  const R = 6371e3
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const A = Math.sin(dLat/2)**2 +
            Math.cos(toRad(a.lat)) *
            Math.cos(toRad(b.lat)) *
            Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A))
}

const routeCoords = [places[0].coords, places[1].coords]
const totalMeters = dist(routeCoords[0], routeCoords[1])
const midpoint    = interp(routeCoords[0], routeCoords[1], 0.5)
const radius      = totalMeters / 2

const fractions  = [0, .25, .5, .75, 1]
const milestones = fractions.map(f => ({
  km: (totalMeters/1000 * f).toFixed(2),
  coords: interp(routeCoords[0], routeCoords[1], f)
}))

// --- MOCK DATA ---
const gruposEdad  = ['0-17','18-35','36-50','51-65','66+']
const clasesSocio = ['A','B','C','D','E']
const personas = Array.from({ length: 20 }, (_, i) => {
  const f    = Math.random()
  const base = interp(routeCoords[0], routeCoords[1], f)
  return {
    id: `p${i+1}`,
    name: `Persona ${i+1}`,
    coords: {
      lat: base.lat + (Math.random() - .5)*.0005,
      lng: base.lng + (Math.random() - .5)*.0005
    },
    edadGrupo: gruposEdad[Math.floor(Math.random()*gruposEdad.length)],
    clase:     clasesSocio[Math.floor(Math.random()*clasesSocio.length)]
  }
})

const poiCats = ['Restaurantes','Parques','Museos','Hospitales']
const latMin  = Math.min(routeCoords[0].lat, routeCoords[1].lat)
const latMax  = Math.max(routeCoords[0].lat, routeCoords[1].lat)
const lngMin  = Math.min(routeCoords[0].lng, routeCoords[1].lng)
const lngMax  = Math.max(routeCoords[0].lng, routeCoords[1].lng)
const pois = Array.from({ length: 30 }, (_, i) => ({
  id: `poi${i+1}`,
  coords: {
    lat: latMin + Math.random()*(latMax-latMin),
    lng: lngMin + Math.random()*(lngMax-lngMin)
  },
  type: poiCats[Math.floor(Math.random()*poiCats.length)]
}))

// --- OVERLAYS STORAGE ---
let placeMarkers     = []
let milestoneMarkers = []
let personMarkers    = []
let poiMarkers       = []
let routeLine        = null
let areaCircle       = null

// --- DYNAMIC LOADER ---
function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script')
    s.src   = src; s.async = true
    s.onload  = () => res()
    s.onerror = () => rej()
    document.head.append(s)
  })
}
async function loadGoogleMaps() {
  if (!window.google?.maps) {
    await loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    )
  }
}

// --- MAP METHODS ---
function initMap() {
  map.value = new google.maps.Map(mapRef.value, {
    center: routeCoords[0],
    zoom: 15,
    mapTypeId: mapType.value
  })
}
function drawRoute() {
  routeLine = new google.maps.Polyline({
    path: routeCoords,
    strokeColor: '#FF5722',
    strokeWeight: 4,
    map: map.value
  })
}
function drawCircle() {
  areaCircle = new google.maps.Circle({
    center: midpoint,
    radius,
    strokeColor: '#42b983',
    strokeOpacity: 0.6,
    fillColor:   '#42b983',
    fillOpacity: 0.1,
    map: map.value
  })
}
// …add/remove for places, milestones, people, pois (same as before)…

// --- CONTROLS & EVENTS ---
function setMapType(type) {
  mapType.value = type
  map.value.setMapTypeId(type)
}
function acercar()  { map.value.setZoom(map.value.getZoom()+1) }
function alejar()   { map.value.setZoom(map.value.getZoom()-1) }
function recentrar(){ map.value.setCenter(routeCoords[0]) }
function irAlugar(p) {
  map.value.panTo(p.coords)
  map.value.setZoom(17)
}

// Toggle layers
function toggle(layer) {
  if (layer === 'places')     { showPlaces.value ? removePlaces()     : addPlaces();     showPlaces.value = !showPlaces.value }
  if (layer === 'milestones') { showMilestones.value ? removeMilestones() : addMilestones(); showMilestones.value = !showMilestones.value }
  if (layer === 'people')     { showPeople.value ? removePeople()     : addPeople();     showPeople.value = !showPeople.value }
  if (layer === 'analytics')  { showAnalytics.value = !showAnalytics.value }
}

// --- MOUNT SEQUENCE ---
onMounted(async () => {
  await loadGoogleMaps()

  initMap()
  drawRoute()
  drawCircle()
  addPlaces()
  addMilestones()
  addPeople()
  addPOIs()
})
</script>
