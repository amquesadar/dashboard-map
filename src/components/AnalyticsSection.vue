<template>
  <div class="analytics">
    <div class="panel">
      <h3>Distribución Socioeconómica</h3>
      <canvas ref="chartSocioRef"></canvas>
    </div>
    <div class="panel">
      <h3>Distribución por Edad</h3>
      <canvas ref="chartAgeRef"></canvas>
    </div>
    <div class="panel">
      <h3>Puntos de Interés</h3>
      <canvas ref="chartPOIRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'

const props = defineProps({
  personas:     { type: Array, required: true },
  clasesSocio:  { type: Array, required: true },
  gruposEdad:   { type: Array, required: true },
  pois:         { type: Array, required: true },
  poiCats:      { type: Array, required: true }
})

const chartSocioRef = ref(null)
const chartAgeRef   = ref(null)
const chartPOIRef   = ref(null)

let socioChart, ageChart, poiChart

// Load Chart.js dynamically if needed
async function loadChartJS() {
  if (!window.Chart) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src   = 'https://cdn.jsdelivr.net/npm/chart.js'
      script.async = true
      script.onload  = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
}

// Initialize all three charts
function initCharts() {
  const ChartJS = window.Chart

  // Socioeconomic distribution
  const countsSocio = props.clasesSocio.map(c =>
    props.personas.filter(p => p.clase === c).length
  )
  socioChart = new ChartJS(
    chartSocioRef.value.getContext('2d'),
    {
      type: 'bar',
      data: {
        labels: props.clasesSocio,
        datasets: [{ data: countsSocio, backgroundColor: '#3f51b5' }]
      },
      options: {
        indexAxis: 'y',
        scales: { x: { beginAtZero: true } },
        plugins: { legend: { display: false } }
      }
    }
  )

  // Age distribution
  const countsEdad = props.gruposEdad.map(gr =>
    props.personas.filter(p => p.edadGrupo === gr).length
  )
  ageChart = new ChartJS(
    chartAgeRef.value.getContext('2d'),
    {
      type: 'bar',
      data: {
        labels: props.gruposEdad,
        datasets: [{ data: countsEdad, backgroundColor: '#4caf50' }]
      },
      options: {
        indexAxis: 'y',
        scales: { x: { beginAtZero: true } },
        plugins: { legend: { display: false } }
      }
    }
  )

  // Points of Interest distribution
  const countsPOI = props.poiCats.map(t =>
    props.pois.filter(o => o.type === t).length
  )
  poiChart = new ChartJS(
    chartPOIRef.value.getContext('2d'),
    {
      type: 'bar',
      data: {
        labels: props.poiCats,
        datasets: [{ data: countsPOI, backgroundColor: '#ff9800' }]
      },
      options: {
        indexAxis: 'y',
        scales: { x: { beginAtZero: true } },
        plugins: { legend: { display: false } }
      }
    }
  )
}

onMounted(async () => {
  await loadChartJS()
  initCharts()
})
</script>
