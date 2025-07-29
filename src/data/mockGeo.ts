// src/data/mockGeo.ts

import type { LatLngLiteral } from 'vue-google-maps'

// Extra “features” / points of interest in the area
export interface GeoFeature {
  id: string
  name: string
  position: LatLngLiteral
  description: string
  category: 'historic' | 'viewpoint' | 'church'
}

export const FEATURES: GeoFeature[] = [
  {
    id: 'plaza',
    name: 'Plaza de Bolívar',
    position: { lat: 4.5981, lng: -74.0758 },
    description: 'Colonial square & seat of government.',
    category: 'historic',
  },
  {
    id: 'monserrate',
    name: 'Monserrate Sanctuary',
    position: { lat: 4.5980, lng: -74.0873 },
    description: 'Hilltop church with city views.',
    category: 'church',
  },
  {
    id: 'capitolio',
    name: 'Capitolio Nacional',
    position: { lat: 4.5986, lng: -74.0766 },
    description: 'Colombian Congress building.',
    category: 'historic',
  },
]
