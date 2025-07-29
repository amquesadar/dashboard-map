import type { Ref } from 'vue'
import type { LatLngLiteral } from 'google.maps'

function interp(a: LatLngLiteral, b: LatLngLiteral, f: number): LatLngLiteral {
  return { lat: a.lat + (b.lat - a.lat)*f, lng: a.lng + (b.lng - a.lng)*f }
}

function dist(a: LatLngLiteral, b: LatLngLiteral): number {
  const toRad = (d: number) => (d * Math.PI)/180
  const R = 6371e3
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const A =
    Math.sin(dLat/2)**2 +
    Math.cos(toRad(a.lat)) *
    Math.cos(toRad(b.lat)) *
    Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A))
}

export default function useRouteOverlay(
  map: Ref<google.maps.Map | null>,
  start: LatLngLiteral,
  end: LatLngLiteral
) {
  const routeCoords: LatLngLiteral[] = [start, end]
  const totalMeters = dist(start, end)
  const midpoint    = interp(start, end, 0.5)
  const radius      = totalMeters / 2

  const fractions = [0, 0.25, 0.5, 0.75, 1]
  const milestones = fractions.map(f => ({
    km:    ((totalMeters/1000)*f).toFixed(2),
    coords: interp(start, end, f)
  }))

  function drawRoute(): void {
    if (!map.value) return
    new google.maps.Polyline({
      path: routeCoords,
      strokeColor: '#FF5722',
      strokeWeight: 4,
      map: map.value
    })
  }

  function drawCircle(): void {
    if (!map.value) return
    new google.maps.Circle({
      center: midpoint,
      radius,
      strokeColor: '#42b983',
      strokeOpacity: 0.6,
      fillColor:   '#42b983',
      fillOpacity: 0.1,
      map: map.value
    })
  }

  return {
    routeCoords,
    milestones,
    drawRoute,
    drawCircle
  }
}
