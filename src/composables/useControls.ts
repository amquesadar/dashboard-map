import type { Ref } from 'vue'
import type { LatLngLiteral } from 'google.maps'

export default function useControls(
  map: Ref<google.maps.Map | null>,
  center: LatLngLiteral
) {
  function acercar(): void {
    if (!map.value) return
    map.value.setZoom( (map.value.getZoom() ?? 0) + 1 )
  }

  function alejar(): void {
    if (!map.value) return
    map.value.setZoom( (map.value.getZoom() ?? 0) - 1 )
  }

  function recentrar(): void {
    if (!map.value) return
    map.value.setCenter(center)
  }

  return { acercar, alejar, recentrar }
}
