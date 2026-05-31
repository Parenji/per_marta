import { Link } from 'react-router-dom'
import { Heart, MapPin, Gift } from 'lucide-react'

function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="love-card max-w-2xl w-full p-8 md:p-12 text-center animate-fade-in">
        <div className="mb-8">
          <Heart className="w-16 h-16 mx-auto text-rose-500 animate-pulse-slow" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-rose-800 mb-4">
          💖 30 Anni di Marta 💖
        </h1>
        
        <p className="text-lg text-rose-600 mb-8">
          Scegli come iniziare questa esperienza speciale
        </p>
        
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
          <Link 
            to="/bigliettino"
            className="group block p-6 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 hover:from-rose-200 hover:to-pink-200 transition-all duration-300 border-2 border-rose-200 hover:border-rose-300"
          >
            <Gift className="w-12 h-12 mx-auto text-rose-500 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-semibold text-rose-800 mb-2">
              Bigliettino d'Amore
            </h2>
            <p className="text-rose-600 text-sm">
              Leggi il mio messaggio per te
            </p>
          </Link>
          
          <Link 
            to="/viaggio"
            className="group block p-6 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 transition-all duration-300 border-2 border-pink-200 hover:border-pink-300"
          >
            <MapPin className="w-12 h-12 mx-auto text-pink-500 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-semibold text-pink-800 mb-2">
              Il Nostro Viaggio
            </h2>
            <p className="text-pink-600 text-sm">
              Vai direttamente all'organizzazione
            </p>
          </Link>
        </div>
        
        <div className="mt-8 text-rose-400 text-sm">
          3-9 Agosto 2024 • Istria, Slovenia & Trieste
        </div>
      </div>
    </div>
  )
}

export default Landing
