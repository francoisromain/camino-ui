import 'leaflet'
import { GestureHandling } from 'leaflet-gesture-handling'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
const L = window['L']

L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling)

const leafletTileLayerDefault = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 20,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
)

const leafletMap = map =>
  L.map(map, {
    // zoomControl: true,
    doubleClickZoom: false,
    minZoom: 4,
    gestureHandling: true
  })

const leafletScaleAdd = map => L.control.scale({ imperial: false }).addTo(map)

export { leafletMap, leafletTileLayerDefault, leafletScaleAdd }
