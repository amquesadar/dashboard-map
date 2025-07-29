<template>
    <div class="controls">
      <button @click="$emit('zoom-in')">＋</button>
      <button @click="$emit('zoom-out')">－</button>
      <button @click="$emit('recenter')">Recentrar</button>
      <select @change="$emit('set-type', $event.target.value)" :value="mapType">
        <option value="roadmap">Mapa</option>
        <option value="satellite">Satélite</option>
      </select>
    </div>
  </template>
  
  <script setup>
  defineProps<{ mapType: string }>()
  defineEmits<{
    (e: 'zoom-in'): void
    (e: 'zoom-out'): void
    (e: 'recenter'): void
    (e: 'set-type', type: string): void
  }>()
  </script>
  