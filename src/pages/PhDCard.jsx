import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ArrowRight, Sparkles, Star } from 'lucide-react'

function PhDCard() {
  const [showFullMessage, setShowFullMessage] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="love-card max-w-2xl w-full p-8 md:p-12 animate-fade-in">
        {!showFullMessage ? (
          <div className="text-center">
            <div className="mb-8">
              <GraduationCap className="w-20 h-20 mx-auto text-amber-500 animate-pulse-slow" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-amber-800 mb-4">
              Congratulazioni Dott.ssa!
            </h1>
            
            <p className="text-lg text-amber-600 mb-8">
              Per il giorno del tuo dottorato
            </p>
            
            <button
              onClick={() => setShowFullMessage(true)}
              className="love-button inline-flex items-center gap-2"
            >
              <span>Apri il bigliettino</span>
              <GraduationCap className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 mx-auto text-amber-400 mb-4" />
            </div>
            
            <div className="space-y-6 text-rose-700 leading-relaxed">

    <h1 className="text-[#b83b5e] text-3xl font-bold text-center mb-1">Congratulazioni amore mio! 🎓🎓🎓</h1>
    <div className="text-center text-xl text-[#6a2c70] italic mb-10">Dottoressa! (O YEA) (io sinceramente non so se si dice così anche perchè dottoressa già lo eri quindi forse dovrei dire dottoratessa boh non lo so</div>
    
    <p className="mb-5 text-justify indent-4">Amore mio questa volta sarò più breve. Sei stata super mega bravissima. Nonostante le tante difficoltà non hai mai mollato, sei stata super determinata ma anche super generosa nell'aiutare gli altri anche quando non eri obbligata a farlo. Sei un esempio di generosità, umanità e dolcezza e per questo io ti amo tanto è sono super fiero di te.</p>
    <p className="mb-5 text-justify indent-4">Ora le povere artemie potranno fare il bagnetto in pace... PROPRIO COME NOI! Infatti come regalo ho deciso di prendere un giorno in più a Trieste, in modo da vedere meglio la città e poi essere più chillati e avere più tempo per goderci la piscina della nostra casetta nei giorni in Istria. Spero che ti piaccia ❤ ❤ ❤</p>
    

    
    <div className="text-[#e84545] text-xl text-center my-8">❤ ❤ ❤</div>
    
    <div className="mt-10 text-right pr-2 text-lg leading-loose italic text-[#6a2c70]">
        Ti amo tanto tanto tanto<br />
        Sei il mio orgoglio <br />
        Congratulazioni ancora!<br />
    </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-amber-200 text-center">
              <div className="flex justify-center gap-2 mb-4">
                E adesso........
              </div>
              
              <Link 
                to="/viaggio"
                className="love-button inline-flex items-center gap-2"
              >
                <span>Scopri (di nuovo) il nostro viaggio</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <p className="mt-4 text-rose-400 text-sm">
                2-9 Agosto 2026 • Trieste, Istria e Slovenia
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhDCard