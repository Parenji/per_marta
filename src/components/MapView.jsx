import { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Hotel, MapPin, Navigation } from 'lucide-react'

// Fix default marker icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom icons
const hotelIcon = new L.DivIcon({
  className: 'custom-marker-icon',
  html: `<div style="background: #e11d48; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;"><div style="transform: rotate(45deg); font-size: 14px;">🏨</div></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
})

const placeIcon = new L.DivIcon({
  className: 'custom-marker-icon',
  html: `<div style="background: #3b82f6; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
})

const dayIcon = (day) => new L.DivIcon({
  className: 'custom-marker-icon',
  html: `<div style="background: #10b981; width: 26px; height: 26px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 13px;">${day}</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  popupAnchor: [0, -13],
})

// Hotel markers
const hotelMarkers = [
  {
    id: 'hotel-1',
    position: [45.6495, 13.7768],
    name: 'In centro a Trieste',
    location: 'Trieste',
    dates: '2-3 Agosto',
    bookingLink: 'https://www.booking.com/hotel/it/in-centro-a-trieste-trieste.it.html',
    mapsLink: 'https://maps.app.goo.gl/d3Zm7g2Je99PLdmWA',
  },
  {
    id: 'hotel-2',
    position: [45.1758, 13.7400],
    name: 'Lavanda Apartments & Room',
    location: 'Sveti Lovreč (Istria)',
    dates: '3-6 Agosto',
    bookingLink: 'https://www.booking.com/hotel/hr/lavanda-sveti-lovrec.it.html',
    mapsLink: 'https://maps.app.goo.gl/hPH3n2zo9S23XvLH6',
  },
  {
    id: 'hotel-3',
    position: [46.0569, 14.5058],
    name: 'Apartments SHISHKA',
    location: 'Lubiana',
    dates: '6-9 Agosto',
    bookingLink: 'https://www.booking.com/hotel/si/apartments-shishka.it.html',
    mapsLink: 'https://maps.app.goo.gl/ZExEBSM3Z6Ct2iKr8',
  },
]

// Place markers
const placeMarkers = [
  { id: 'p1', position: [45.6500, 13.7678], name: "Piazza Unità d'Italia", location: 'Trieste', description: 'La piazza più grande d\'Europa aperta sul mare, circondata da sontuosi palazzi neoclassici e storici caffè letterari.' },
  { id: 'p2', position: [45.7047, 13.7128], name: 'Castello di Miramare', location: 'Trieste', description: 'Dimora storica affacciata sul golfo di Trieste, circondata da un parco immenso.' },
  { id: 'p3', position: [45.6510, 13.7680], name: 'Molo Audace', location: 'Trieste', description: 'Passeggiata romantica sul mare nel cuore di Trieste.' },
  { id: 'p4', position: [45.8486, 13.4847], name: 'Sacrario di Redipuglia', location: 'Redipuglia', description: 'Il più grande e maestoso sacrario militare d\'Italia, dedicato ai caduti della Grande Guerra.' },
  { id: 'p5', position: [45.0812, 13.6387], name: 'Rovigno (Rovinj)', location: 'Istria, Croazia', description: 'Una delle città più romantiche dell\'Adriatico, con case colorate che scendono a picco sul mare.' },
  { id: 'p6', position: [45.2272, 13.5954], name: 'Parenzo (Poreč)', location: 'Istria, Croazia', description: 'Città costiera famosa per la Basilica Eufrasiana, patrimonio UNESCO.' },
  { id: 'p7', position: [44.8736, 13.8502], name: 'Pola - Arena Romana', location: 'Istria, Croazia', description: 'Uno degli anfiteatri romani meglio conservati al mondo.' },
  { id: 'p8', position: [45.3367, 13.8283], name: 'Montona (Motovun)', location: 'Istria, Croazia', description: 'Affascinante borgo medievale arroccato, famoso per il tartufo.' },
  { id: 'p9', position: [45.3828, 13.7200], name: 'Grisignana (Grožnjan)', location: 'Istria, Croazia', description: 'Incantevole borgo medievale conosciuto come la "città degli artisti".' },
  { id: 'p10', position: [44.9167, 13.7667], name: 'Isole Brioni (Brijuni)', location: 'Istria, Croazia', description: 'Arcipelago di 14 isole, parco nazionale con siti archeologici romani e safari park.' },
  { id: 'p11', position: [45.1500, 13.6833], name: 'Canale di Leme (Limski Kanal)', location: 'Istria, Croazia', description: 'Spettacolare fiordo scavato nella roccia lungo 12 km.' },
  { id: 'p12', position: [44.8000, 13.9167], name: 'Premantura (Kamenjak)', location: 'Istria, Croazia', description: 'Penisola selvaggia con scogliere mozzafiato e calette nascoste.' },
  { id: 'p13', position: [45.7825, 14.2039], name: 'Grotte di Postumia', location: 'Postumia, Slovenia', description: 'Magico viaggio a bordo di un trenino tra stalattiti millenarie.' },
  { id: 'p14', position: [45.8158, 14.1264], name: 'Castello di Predjama', location: 'Postumia, Slovenia', description: 'Castello medievale costruito all\'interno della bocca di una grotta.' },
  { id: 'p15', position: [46.0514, 14.5060], name: 'Lubiana Centro', location: 'Slovenia', description: 'Capitale verde ed elegante con ponti pittoreschi e un castello che domina la città.' },
  { id: 'p16', position: [46.0489, 14.5086], name: 'Castello di Lubiana', location: 'Slovenia', description: 'Imponente fortezza medievale con vista panoramica a 360°.' },
  { id: 'p17', position: [46.0567, 14.5169], name: 'Metelkova Mesto', location: 'Lubiana, Slovenia', description: 'Vivace centro di cultura autonoma, cuore della street art di Lubiana.' },
  { id: 'p18', position: [46.0533, 14.5036], name: 'Terrazza Nebotičnik', location: 'Lubiana, Slovenia', description: 'Storico grattacielo con caffè panoramico all\'ultimo piano.' },
  { id: 'p19', position: [46.3683, 14.1146], name: 'Lago di Bled', location: 'Slovenia', description: 'Lago da fiaba con isola centrale e castello medievale arroccato.' },
  { id: 'p20', position: [46.3950, 14.0833], name: 'Gola di Vintgar', location: 'Dintorni di Bled, Slovenia', description: 'Spettacolare gola con passerelle di legno su acque turchesi.' },
  { id: 'p21', position: [45.9054, 13.3100], name: 'Palmanova', location: 'Friuli V.G., Italia', description: 'Città-fortezza a forma di stella a nove punte, patrimonio UNESCO.' },
  { id: 'p22', position: [45.4064, 11.8768], name: 'Padova', location: 'Veneto, Italia', description: 'Casa dolce casa! Punto di partenza e arrivo del nostro viaggio.' },
]

// Day markers (main stops per day)
const dayMarkers = [
  { day: 1, position: [45.6495, 13.7768], name: 'Giorno 1 - Trieste', description: 'Castello di Miramare, Piazza Unità, Molo Audace' },
  { day: 2, position: [45.3828, 13.7200], name: 'Giorno 2 - Verso l\'Istria', description: 'Grožnjan, arrivo a Sveti Lovreč' },
  { day: 3, position: [45.0812, 13.6387], name: 'Giorno 3 - Rovigno', description: 'Rovigno, Canale di Leme, relax in spiaggia' },
  { day: 4, position: [44.8736, 13.8502], name: 'Giorno 4 - Pola', description: 'Arena Romana, Brioni o Kamenjak' },
  { day: 5, position: [45.7825, 14.2039], name: 'Giorno 5 - Verso Lubiana', description: 'Grotte di Postumia, Castello di Predjama, arrivo a Lubiana' },
  { day: 6, position: [46.0514, 14.5060], name: 'Giorno 6 - Lubiana', description: 'Castello, Mercato Centrale, Metelkova, Nebotičnik' },
  { day: 7, position: [46.3683, 14.1146], name: 'Giorno 7 - Lago di Bled', description: 'Gola di Vintgar, Lago di Bled, Castello di Bled' },
  { day: 8, position: [45.9054, 13.3100], name: 'Giorno 8 - Rientro', description: 'Palmanova, rientro a Padova' },
]

// Route polyline (overall journey)
const routePath = [
  [45.4064, 11.8768],  // Padova
  [45.6495, 13.7768],  // Trieste
  [45.1758, 13.7400],  // Sveti Lovreč
  [46.0569, 14.5058],  // Lubiana
  [46.3683, 14.1146],  // Bled
  [46.0569, 14.5058],  // Lubiana (ritorno)
  [45.9054, 13.3100],  // Palmanova
  [45.4064, 11.8768],  // Padova
]

// Component to auto-fit map bounds
function MapBounds({ markers }) {
  const map = useMap()
  const bounds = L.latLngBounds(markers.map(m => m.position))
  map.fitBounds(bounds, { padding: [40, 40] })
  return null
}

function MapView() {
  const [showHotels, setShowHotels] = useState(true)
  const [showPlaces, setShowPlaces] = useState(true)
  const [showDays, setShowDays] = useState(true)
  const [showRoute, setShowRoute] = useState(true)

  const allVisibleMarkers = useMemo(() => {
    const markers = []
    if (showHotels) markers.push(...hotelMarkers)
    if (showPlaces) markers.push(...placeMarkers)
    if (showDays) markers.push(...dayMarkers)
    return markers
  }, [showHotels, showPlaces, showDays])

  return (
    <div className="space-y-4">
      {/* Legend / Filter bar */}
      <div className="section-card">
        <h3 className="text-lg font-semibold text-rose-800 mb-3 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-rose-500" />
          Filtra la mappa
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowHotels(!showHotels)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              showHotels
                ? 'bg-rose-500 text-white shadow-lg'
                : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" />
            Hotel
          </button>
          <button
            onClick={() => setShowPlaces(!showPlaces)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              showPlaces
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Luoghi
          </button>
          <button
            onClick={() => setShowDays(!showDays)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              showDays
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
            }`}
          >
            <span className="text-xs">📅</span>
            Tappe
          </button>
          <button
            onClick={() => setShowRoute(!showRoute)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              showRoute
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
            }`}
          >
            <span className="text-xs">〰️</span>
            Percorso
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="section-card p-0 overflow-hidden" style={{ height: '600px', maxHeight: '70vh' }}>
        <MapContainer
          center={[45.5, 13.5]}
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBounds markers={allVisibleMarkers} />

          {/* Hotel markers */}
          {showHotels && hotelMarkers.map(hotel => (
            <Marker key={hotel.id} position={hotel.position} icon={hotelIcon}>
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-rose-700 text-sm mb-1">{hotel.name}</h3>
                  <p className="text-xs text-gray-600 mb-1">📍 {hotel.location}</p>
                  <p className="text-xs text-gray-500 mb-2">📅 {hotel.dates}</p>
                  <div className="flex gap-1.5">
                    <a
                      href={hotel.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-rose-500 text-white text-center py-1 rounded text-xs hover:bg-rose-600 transition-colors"
                    >
                      Booking
                    </a>
                    <a
                      href={hotel.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-pink-500 text-white text-center py-1 rounded text-xs hover:bg-pink-600 transition-colors"
                    >
                      Maps
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Place markers */}
          {showPlaces && placeMarkers.map(place => (
            <Marker key={place.id} position={place.position} icon={placeIcon}>
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h3 className="font-bold text-blue-700 text-sm mb-1">{place.name}</h3>
                  <p className="text-xs text-gray-600 mb-1">📍 {place.location}</p>
                  <p className="text-xs text-gray-500">{place.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Day markers */}
          {showDays && dayMarkers.map(day => (
            <Marker key={`day-${day.day}`} position={day.position} icon={dayIcon(day.day)}>
              <Popup>
                <div style={{ minWidth: '180px' }}>
                  <h3 className="font-bold text-emerald-700 text-sm mb-1">{day.name}</h3>
                  <p className="text-xs text-gray-500">{day.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Route polyline */}
          {showRoute && (
            <Polyline
              positions={routePath}
              pathOptions={{
                color: '#a855f7',
                weight: 4,
                opacity: 0.7,
                dashArray: '10 6',
                lineCap: 'round',
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="section-card">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow"></div>
            <span className="text-rose-700">Hotel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
            <span className="text-blue-700">Luoghi da visitare</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow flex items-center justify-center text-white text-[10px] font-bold">8</div>
            <span className="text-emerald-700">Tappe giornaliere</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-purple-500 opacity-70" style={{ borderTop: '2px dashed #a855f7' }}></div>
            <span className="text-purple-700">Percorso</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapView