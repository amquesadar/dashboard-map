import { ref, Ref } from 'vue'

const mapRef = ref<HTMLElement | null>(null)
const map    = ref<google.maps.Map | null>(null)

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src   = src
    s.async = true
    s.onload  = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(s)
  })
}

export async function loadGoogleMaps(apiKey: string): Promise<void> {
  if (!(window as any).google?.maps) {
    await loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    )
  }
}

export function initMap(
  center: google.maps.LatLngLiteral,
  zoom = 15,
  mapTypeId: google.maps.MapTypeId | string = 'roadmap'
): void {
  if (!mapRef.value) return
  map.value = new google.maps.Map(mapRef.value, {
    center,
    zoom,
    mapTypeId
  })
}

export function setMapType(type: string): void {
  if (!map.value) return
  map.value.setMapTypeId(type as google.maps.MapTypeId)
}

export { mapRef, map }
