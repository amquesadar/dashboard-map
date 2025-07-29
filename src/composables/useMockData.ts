import type { LatLngLiteral } from 'google.maps'

export const clasesSocio = ['A','B','C','D','E']
export const gruposEdad  = ['0-17','18-35','36-50','51-65','66+']
export const poiCats      = ['Restaurantes','Parques','Museos','Hospitales']

export const places = [
  {
    id:    'start',
    label: 'Inicio de Ruta',
    coords: { lat: 4.5726604, lng: -74.0914428 },
    color: 'red'
  },
  {
    id:    'end',
    label: 'Fin de Ruta',
    coords: { lat: 4.5769169, lng: -74.0884495 },
    color: 'black'
  }
]

function interp(a: LatLngLiteral, b: LatLngLiteral, f: number): LatLngLiteral {
  return {
    lat: a.lat + (b.lat - a.lat)*f,
    lng: a.lng + (b.lng - a.lng)*f
  }
}

export const personas = Array.from({ length: 20 }, (_, i) => {
  const f    = Math.random()
  const base = interp(places[0].coords, places[1].coords, f)
  return {
    id:        `p${i+1}`,
    name:      `Persona ${i+1}`,
    coords:    {
      lat: base.lat + (Math.random() - .5)*.0005,
      lng: base.lng + (Math.random() - .5)*.0005
    },
    edadGrupo: gruposEdad[Math.floor(Math.random()*gruposEdad.length)],
    clase:     clasesSocio[Math.floor(Math.random()*clasesSocio.length)]
  }
})

const latMin = Math.min(places[0].coords.lat, places[1].coords.lat)
const latMax = Math.max(places[0].coords.lat, places[1].coords.lat)
const lngMin = Math.min(places[0].coords.lng, places[1].coords.lng)
const lngMax = Math.max(places[0].coords.lng, places[1].coords.lng)

export const pois = Array.from({ length: 30 }, (_, i) => {
  const lat = latMin + Math.random()*(latMax-latMin)
  const lng = lngMin + Math.random()*(lngMax-lngMin)
  return {
    id:    `poi${i+1}`,
    coords: { lat, lng },
    type:  poiCats[Math.floor(Math.random()*poiCats.length)]
  }
})
