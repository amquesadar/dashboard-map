<template>
    <header class="header">
      <img src="@/assets/logo.svg" alt="Logo" class="logo" />
  
      <div class="search-bar">
        <input
          v-model="searchQuery"
          placeholder="Buscar un lugar..."
          class="search-input"
        />
        <ul v-if="searchQuery && filteredPlaces.length" class="suggestions">
          <li
            v-for="p in filteredPlaces"
            :key="p.id"
            @click="selectPlace(p)"
            class="suggestion-item"
          >
            {{ p.label }}
          </li>
        </ul>
      </div>
  
      <div class="map-toggle">
        <button
          @click="onSetMapType('roadmap')"
          :class="{ active: mapType === 'roadmap' }"
        >
          Mapa
        </button>
        <button
          @click="onSetMapType('satellite')"
          :class="{ active: mapType === 'satellite' }"
        >
          Satélite
        </button>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, defineProps, defineEmits } from 'vue'
  
  const props = defineProps<{
    places: { id: string; label: string; coords: any }[]
    mapType: string
  }>()
  
  const emit = defineEmits<{
    (e: 'go-to', place: { id: string; label: string; coords: any }): void
    (e: 'set-map-type', type: string): void
  }>()
  
  const searchQuery = ref('')
  
  const filteredPlaces = computed(() =>
    props.places.filter(p =>
      p.label.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )
  
  function selectPlace(p: { id: string; label: string; coords: any }) {
    emit('go-to', p)
    searchQuery.value = ''
  }
  
  function onSetMapType(type: string) {
    emit('set-map-type', type)
  }
  </script>
  