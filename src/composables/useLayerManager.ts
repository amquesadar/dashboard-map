import { reactive, Ref } from 'vue'
import { places, personas, pois } from '@/composables/useMockData'
import useRouteOverlay from '@/composables/useRouteOverlay'

export default function useLayerManager(
  map: Ref<google.maps.Map | null>
) {
  const { milestones } = useRouteOverlay(
    map,
    places[0].coords,
    places[1].coords
  )

  const placeMarkers:     google.maps.Marker[] = []
  const milestoneMarkers: google.maps.Marker[] = []
  const personMarkers:    google.maps.Marker[] = []
  const poiMarkers:       google.maps.Marker[] = []

  function addPlaces(): void {
    if (!map.value) return
    places.forEach(p => {
      const m = new google.maps.Marker({
        position: p.coords,
        map: map.value,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: p.color,
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#fff'
        },
        title: p.label
      })
      placeMarkers.push(m)
    })
  }
  function removePlaces(): void {
    placeMarkers.forEach(m => m.setMap(null))
    placeMarkers.length = 0
  }

  function addMilestones(): void {
    if (!map.value) return
    milestones.forEach(ms => {
      const m = new google.maps.Marker({
        position: ms.coords,
        map: map.value,
        label: { text: `${ms.km} km`, fontSize: '10px' }
      })
      // 4m yellow circle around each
      new google.maps.Circle({
        center: ms.coords,
        radius: 4,
        strokeColor: '#FFEB3B',
        strokeOpacity: 0.9,
        fillColor:   '#FFEB3B',
        fillOpacity: 0.3,
        map: map.value
      })
      milestoneMarkers.push(m)
    })
  }
  function removeMilestones(): void {
    milestoneMarkers.forEach(m => m.setMap(null))
    milestoneMarkers.length = 0
  }

  function addPeople(): void {
    if (!map.value) return
    personas.forEach(p => {
      const m = new google.maps.Marker({
        position: p.coords,
        map:      map.value,
        icon: {
          path:        google.maps.SymbolPath.CIRCLE,
          scale:       4,
          fillColor:   '#2196f3',
          fillOpacity: 0.8,
          strokeWeight:0
        },
        title: `${p.name} | Edad: ${p.edadGrupo} | Clase: ${p.clase}`
      })
      personMarkers.push(m)
    })
  }
  function removePeople(): void {
    personMarkers.forEach(m => m.setMap(null))
    personMarkers.length = 0
  }

  function addPOIs(): void {
    if (!map.value) return
    pois.forEach(o => {
      const m = new google.maps.Marker({
        position: o.coords,
        map:      map.value,
        icon: {
          path:        google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale:       4,
          fillColor:   '#ff9800',
          fillOpacity: 0.9,
          strokeWeight:1,
          strokeColor: '#fff'
        },
        title: o.type
      })
      poiMarkers.push(m)
    })
  }
  function removePOIs(): void {
    poiMarkers.forEach(m => m.setMap(null))
    poiMarkers.length = 0
  }

  const layers = reactive({
    places:     true,
    milestones: true,
    people:     true,
    pois:       true
  })

  function toggleLayer(layer: keyof typeof layers): void {
    if (layers[layer]) {
      if (layer === 'places')     removePlaces()
      if (layer === 'milestones') removeMilestones()
      if (layer === 'people')     removePeople()
      if (layer === 'pois')       removePOIs()
    } else {
      if (layer === 'places')     addPlaces()
      if (layer === 'milestones') addMilestones()
      if (layer === 'people')     addPeople()
      if (layer === 'pois')       addPOIs()
    }
    layers[layer] = !layers[layer]
  }

  function addAll(): void {
    addPlaces()
    addMilestones()
    addPeople()
    addPOIs()
  }

  return {
    layers,
    addAll,
    toggleLayer
  }
}
