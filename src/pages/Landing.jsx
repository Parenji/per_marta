import { Link } from 'react-router-dom'
import { Heart, MapPin, GraduationCap } from 'lucide-react'

function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="love-card max-w-2xl w-full p-8 md:p-12 text-center animate-fade-in">
        <div className="mb-8">
          <GraduationCap className="w-16 h-16 mx-auto text-amber-500 animate-pulse-slow" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-rose-800 mb-4">
          💖 Per Marta 🎓
        </h1>
        
        <p className="text-lg text-rose-600 mb-8">
          Scegli come iniziare questa esperienza speciale
        </p>
        
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
          <Link 
            to="/dottorato"
            className="group block p-6 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 transition-all duration-300 border-2 border-amber-200 hover:border-amber-300"
          >
            <GraduationCap className="w-12 h-12 mx-auto text-amber-600 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-semibold text-amber-800 mb-2">
              Congratulazioni Dott.ssa!
            </h2>
            <p className="text-amber-700 text-sm">
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
          2-9 Agosto 2026 • Trieste, Istria & Slovenia
        </div>
      </div>
    </div>
  )
}

export default Landing