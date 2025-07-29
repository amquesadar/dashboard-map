<template>
    <section class="map-section">
      <div ref="mapRef" class="map-container"></div>
  
      <Controls
        :zoom="map.getZoom()"
        @zoom-in="acercar"
        @zoom-out="alejar"
        @recenter="recentrar"
        @set-type="setMapType"
        :map-type="mapType"
      />
  
      <Toggles
        :layers="layers"
        @toggle-layer="toggleLayer"
      />
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Controls from './Controls.vue'
  import Toggles from './Toggles.vue'
  import useGoogleMaps from '@/composables/useGoogleMaps'
  import useRouteOverlay from '@/composables/useRouteOverlay'
  import useLayerManager from '@/composables/useLayerManager'
  import useControls from '@/composables/useControls'
  
  const { mapRef, map, loadGoogleMaps, initMap } = useGoogleMaps()
  const { drawRoute, drawCircle } = useRouteOverlay(map)
  const {
    layers, addAll, removeAll, toggleLayer
  } = useLayerManager(map)
  
  const { acercar, alejar, recentrar, setMapType, mapType } = useControls(map)
  
  onMounted(async () => {
    await loadGoogleMaps()
    initMap()
    drawRoute()
    drawCircle()
    addAll()
  })
  </script>
  