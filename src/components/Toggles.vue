<template>
    <div class="toggles">
      <button
        v-for="layer in Object.keys(layers)"
        :key="layer"
        @click="$emit('toggle-layer', layer)"
      >
        {{ layers[layer] ? 'Ocultar' : 'Mostrar' }} {{ layer }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Layers { [key: string]: boolean }
  const props = defineProps<{ layers: Layers }>()
  const emit = defineEmits<{
    (e: 'toggle-layer', layer: string): void
  }>()
  </script>
  