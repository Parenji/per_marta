import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ArrowRight, Sparkles, Star } from 'lucide-react'

function GreetingCard() {
  const [showFullMessage, setShowFullMessage] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="love-card max-w-2xl w-full p-8 md:p-12 animate-fade-in">
        {!showFullMessage ? (
          <div className="text-center">
            <div className="mb-8">
              <Heart className="w-20 h-20 mx-auto text-rose-500 animate-pulse-slow" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-rose-800 mb-4">
              Per la mia Marta
            </h1>
            
            <p className="text-lg text-rose-600 mb-8">
              In occasione dei suoi 30 anni
            </p>
            
            <button
              onClick={() => setShowFullMessage(true)}
              className="love-button inline-flex items-center gap-2"
            >
              <span>Apri il bigliettino</span>
              <Heart className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 mx-auto text-rose-400 mb-4" />
            </div>
            
            <div className="space-y-6 text-rose-700 leading-relaxed">

    <h1 className="text-[#b83b5e] text-3xl font-bold text-center mb-1">Tanti auguri amore mio! 💖💖💖</h1>
    <div className="text-center text-xl text-[#6a2c70] italic mb-10">Buon trentesimo compleanno!</div>
    
    <p className="mb-5 text-justify indent-4">Anche tu sei arrivata ai 30, che strano! A me sembra che siamo ancora piccoli... e vbb...</p>
    <p className="mb-5 text-justify indent-4">Chissà quante cose ancora non so dei 29 anni che hai vissuto senza di me, chissà quante esperienze ti hanno portato a essere quella che sei, chissà quante sfumature purtroppo non riesco ancora a cogliere per questo motivo..</p>
    <p className="mb-5 text-justify indent-4">Un anno fa avevamo passato una bellissima serata tra Caprarola e Vitorchiano, wow mi sembra ieri che passeggiavamo per quei vicoli addobbati a tema giochi. E poi che buona quella cena, non vedo l'ora di tornare all'Antica Cantina con te a pappare un sacco di cibo, magari questo autunno coi porcini freschi.</p>
    <p className="mb-5 text-justify indent-4">Purtroppo stavolta dobbiamo festeggiare lontani e non possiamo riempirci di abbraccini e mi sembra tanto ingiusto e mi sento anche un po' in colpa... siamo stati 29 anni lontani e ancora dobbiamo continuare a esserlo. UFFI PUFFI!</p>
    
    <div className="text-center text-2xl font-bold text-[#b83b5e] my-10 py-2 border-y border-dashed border-[#e84545]">
        però
    </div>
    
    <p className="mb-5 text-justify indent-4">Presto ci rivedremo e ci faremo un sacco di coccoline e coccolone e ti riempirò di bacini e soprattutto.. tra non molto faremo la nostra prima vacanza insieme. Io davvero non vedo l'ora, so già che sarà stupendo, vedremo posti bellissimi e faremo l'amore tantissimo.</p>
    
    <p className="mb-5 text-justify indent-4">Penso di avertelo già detto quindi non è che ti stia facendo chissà quale sorpresa, ma il mio regalo per te sono i due appartamenti che ho prenotato per il nostro viaggetto insieme (e sì, li pago io, non come hai detto nella chiamata di poche ore fa, n.d.r.), spero ti piacciano amore mio. Quello in Istria mi sembra veramente carino (te lo avevo già mostrato), quello a Lubiana è più normale ma vbb dai sembra carino anche quello. </p>
    <p className="mb-5 text-justify indent-4">Questo sito è tutto per noi, l'ho fatto io per rendere il nostro viaggio più carino e piacevole. A dirla tutta è ancora un po' work in progress, ma in fondo è giusto così. Lo modificheremo insieme mano a mano che ci avvicineremo al giorno della partenza, aggiungendo tutte le cose che scopriremo e che vorremo vedere o pappare o toccare o boh non so quali altri verbi usare.. L'ai mi ha aiutato a costruire il sito (ci ho messo comunque un saccoooo) e anche a fare l'itinerario (che ho controllato attentamente e comunque, ovviamente, è indicativo e modificabile), ma tranquilla questo bigliettino lo ho fatto io giurooo. Ovviamente possiamo ancora modificare tutto anche per organizzarci bene col campeggio con la Alessia e Marco. </p>
    
    <p className="mb-5 text-justify indent-4">Vabbè, sto andando fin troppo per le lunghe. Amore mio sei la mia stella polare, mi rendi felice e mi rendi migliore ogni giorno. Senza di te sono solo uno sbirulone.</p>
    
    <div className="text-[#e84545] text-xl text-center my-8">❤ ❤ ❤</div>
    
    <div className="mt-10 text-right pr-2 text-lg leading-loose italic text-[#6a2c70]">
        Ti amo tanto tanto tanto<br />
        Mi manchi tanto tanto tanto <br />
 Tanti tanti tanti auguri<br />
    </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-rose-200 text-center">
              <div className="flex justify-center gap-2 mb-4">
E adesso........
              </div>
              
              <Link 
                to="/viaggio"
                className="love-button inline-flex items-center gap-2"
              >
                <span>Scopri il nostro viaggio</span>
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

export default GreetingCard
