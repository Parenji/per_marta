import { useState, useEffect } from 'react'
import { MapPin, Calendar, Hotel, Car, Utensils, Camera, Luggage, Edit3, ExternalLink, Heart, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

function TravelHome() {
  const [activeSection, setActiveSection] = useState('hotels')
  const [selectedFoodDay, setSelectedFoodDay] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const hotels = [
    {
      id: 1,
      name: "Lavanda Apartments & Room",
      location: "Sveti Lovreč (Istria)",
      dates: "3-6 Agosto",
      bookingLink: "https://www.booking.com/hotel/hr/lavanda-sveti-lovrec.it.html?aid=304142&label=gen173bo-10CAsoZUIUbGF2YW5kYS1zdmV0aS1sb3ZyZWNIFFgDaHGIAQGYATO4AQfIAQ_YAQPoAQH4AQGIAgGYAgSoAgG4ArWy59AGwAIB0gIkYzZhMWIyYmMtNjA5Ny00NTZjLTg4MWQtY2JkYWI5YWE0YmNl2AIB4AIB&sid=b4c6045cf35efce17f79972e628375a6&age=0&checkin=2026-08-09&checkout=2026-08-10&dest_id=-87546&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&soh=1&sr_order=popularity&srepoch=1780078907&srpvid=f998811b953f0396&type=total&ucfs=1&#no_availability_msg",
      mapsLink: "https://maps.app.goo.gl/B9qYA7XcamcbbbU38?g_st=ic",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/754835089.jpg?k=87a03ff645a4c940c9226e41f568eae378a19639b6f393beed8c218fd83409f3&o=",
      notes: "Cancellazione gratuita entro il 3 luglio"
    },
    {
      id: 2,
      name: "Apartments SHISHKA",
      location: "Lubiana",
      dates: "6-9 Agosto",
      bookingLink: "https://www.booking.com/hotel/si/apartments-shishka.it.html?aid=304142&label=gen173bo-10CAsoywFCEmFwYXJ0bWVudHMtc2hpc2hrYUgUWANocYgBAZgBM7gBB8gBD9gBA-gBAfgBAYgCAZgCBKgCAbgC2rLn0AbAAgHSAiQ0MDFhNDRkNC03MzMwLTRhYzItOTNiYy00MmQxMjdmYWU3MjTYAgHgAgE&sid=b4c6045cf35efce17f79972e628375a6&age=0&checkin=2026-08-09&checkout=2026-08-10&dest_id=-87271&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&soh=1&sr_order=popularity&srepoch=1780078943&srpvid=9806812d8eea0e9b&type=total&ucfs=1&#no_availability_msg",
      mapsLink: "https://maps.app.goo.gl/ZExEBSM3Z6Ct2iKr8?g_st=ic",
      image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/84243557.jpg?k=1d98d7db4adb33f1fa22a4daa1061cbc6827026ee0fffbb9cdd9addb66b0c0fd&o=",
      notes: "Cancellazione gratuita entro il 1 agosto"
    },
  ]

const itinerary = [
  {
    "day": 1,
    "date": "3 Agosto",
    "title": "Padova, Trieste e Arrivo in Istria",
    "activities": [
      "Partenza da Padova al mattino presto in direzione Trieste.",
      "Sosta a Trieste: passeggiata in Piazza Unità d'Italia e caffè storico.",
      "Visita al Castello di Miramare e ai suoi splendidi giardini sul mare.",
      "Pomeriggio: viaggio verso l'Istria, passaggio della frontiera e arrivo a Sveti Lovreč.",
      "Check-in e cena romantica a base di specialità istriane (tartufo e fusi) a Sveti Lovreč o Parenzo."
    ]
  },
  {
    "day": 2,
    "date": "4 Agosto",
    "title": "Il fascino di Rovigno e il Canale di Leme",
    "activities": [
      "Mattina: Esplorazione del centro storico di Rovigno (Rovinj), camminando tra le viuzze fino alla Chiesa di Sant'Eufemia.",
      "Pranzo in un ristorantino tipico sul porto di Rovigno.",
      "Pomeriggio: Vista panoramica del Canale di Leme (Limski Kanal) e relax in spiaggia (es. Lone Bay o Punta Corrente).",
      "Sera: Rientro a Sveti Lovreč, passeggiata tra le mura medievali del borgo e cena tranquilla."
    ]
  },
  {
    "day": 3,
    "date": "5 Agosto",
    "title": "Pola Romana e i borghi dell'entroterra",
    "activities": [
      "Mattina: Visita a Pola (Pula) per ammirare la maestosa Arena Romana, il Tempio di Augusto e l'Arco dei Sergi.",
      "Pranzo veloce a Pola e spostamento verso l'entroterra istriano.",
      "Pomeriggio: Visita a Motovun (Montona) o Grožnjan (Grisignana), incantevoli borghi degli artisti arroccati sulle colline.",
      "Sera: pappa pappa pappa pappa pappa"
    ]
  },
  {
    "day": 4,
    "date": "6 Agosto",
    "title": "Dall'Istria alle Grotte di Postumia fino a Lubiana",
    "activities": [
      "Mattina: Check-out da Sveti Lovreč e partenza verso la Slovenia.",
      "Sosta lungo il tragitto per visitare le Grotte di Postumia o il suggestivo Castello di Predjama.",
      "Pranzo nei pressi di Postumia.",
      "Pomeriggio: Arrivo a Lubiana (Ljubljana), check-in in alloggio e primo orientamento nel centro pedonale.",
      "Sera: Passeggiata lungo il fiume Ljubljanica e cena in uno dei vivaci locali del centro."
    ]
  },
  {
    "day": 5,
    "date": "7 Agosto",
    "title": "Esplorazione di Lubiana",
    "activities": [
      "Mattina: Salita in funicolare al Castello di Lubiana per una vista panoramica sulla città.",
      "Visita al Mercato Centrale, al Ponte dei Draghi e al Triplo Ponte progettato da Plečnik.",
      "Pranzo lungo il fiume provando i 'štruklji' sloveni.",
      "Pomeriggio: Relax al Parco Tivoli, visita al quartiere alternativo di Metelkova Mesto o aperitivo panoramico alla Terrazza Nebotičnik.",
      "Sera: (Qui Gemini ha sgravato ci ha preso per miliardari) Crociera romantica in barca sulla Ljubljanica al tramonto e cena gourmet."
    ]
  },
  {
    "day": 6,
    "date": "8 Agosto",
    "title": "Escursione al Lago di Bled e Gola di Vintgar",
    "activities": [
      "Mattina: Escursione in giornata al Lago di Bled. Visita alla spettacolare gola di Vintgar (Vintgar Gorge).",
      "Giro del lago e traversata sulla tradizionale barca 'pletna' per raggiungere l'isoletta centrale.",
      "Pranzo a Bled assaggiando la famosa torta cremosa 'Kremšnita'.",
      "Pomeriggio: Salita al Castello di Bled per una vista mozzafiato o relax sulle sponde del lago.",
      "Sera: Rientro a Lubiana per l'ultima sera e cena d'addio."
    ]
  },
  {
    "day": 7,
    "date": "9 Agosto",
    "title": "Lubiana e rientro a Padova",
    "activities": [
      "Mattina: Colazione con calma, ultimi acquisti di souvenir a Lubiana e check-out.",
      "Opzione: Breve sosta naturalistica o culturale lungo il percorso di ritorno.",
      "Pranzo libero lungo il percorso di viaggio.",
      "Pomeriggio: Viaggio di rientro in autostrada in direzione Padova.",
      "Arrivo a Padova in serata."
    ]
  }
];

const placesToVisit = [
  {
    "name": "Piazza Unità d'Italia",
    "location": "Trieste, Italia",
    "description": "La piazza più grande d'Europa aperta sul mare, circondata da sontuosi palazzi neoclassici e storici caffè letterari.",
    "image": "https://media.istockphoto.com/id/2231781803/photo/trieste-piazza-unit%C3%A0-ditalia-waterfront-view.jpg?s=612x612&w=0&k=20&c=tFnOlsamFk5yg7e-MiN30O4jm4qmKyp_XxfkxjVNz4I="
  },
  {
    "name": "Castello di Miramare",
    "location": "Trieste, Italia",
    "description": "Dimora storica affacciata sul golfo di Trieste, circondata da un parco immenso, costruita per l'arciduca Massimiliano d'Asburgo.",
    "image": "https://miramare.cultura.gov.it/wp-content/uploads/2023/07/CastelloMare5-scaled.jpg"
  },
  {
    "name": "Rovigno (Rovinj)",
    "location": "Istria, Croazia",
    "description": "Una delle città più romantiche dell'Adriatico, con le sei case colorate che scendono a picco sul mare e la chiesa di Sant'Eufemia che svetta sul borgo.",
    "image": "https://magazine.happyage.it/wp-content/uploads/2023/04/Rovigno-cosa-vedere.jpg"
  },
  {
    "name": "Parenzo (Poreč)",
    "location": "Istria, Croazia",
    "description": "Città costiera famosa per la Basilica Eufrasiana, patrimonio UNESCO, con il suo splendido mosaico bizantino del VI secolo e un centro storico medievale ben conservato.",
    "image": "https://www.croazia.info/wp-content/uploads/sites/78/parenzo-hd.jpg"
  },
  {
    "name": "Pola - Arena Romana",
    "location": "Istria, Croazia",
    "description": "Uno degli anfiteatri romani meglio conservati al mondo, simbolo della storia millenaria dell'Istria.",
    "image": "https://www.visitpula.hr/wp-content/uploads/2023/08/Pula-Arial-view-Arena.jpg"
  },
  {
    "name": "Motovun (Montona)",
    "location": "Istria, Croazia",
    "description": "Affascinante borgo medievale arroccato su una collina nel cuore verde dell'Istria, famoso per il tartufo e i panorami mozzafiato.",
    "image": "https://www.valamar-experience.com/media/_versions/cities/istra/motovun/motovun_panorama_gallery_main.jpg"
  },
  {
    "name": "Castello di Predjama",
    "location": "Postumia, Slovenia",
    "description": "Un incredibile castello medievale unico al mondo, costruito oltre 800 anni fa direttamente all'interno della bocca di una grotta, incastonato su una parete di roccia alta 123 metri.",
    "image": "https://viaggiscrittiamano.com//wp-content/uploads/2025/07/IMG_3790-edited.jpg"
  },
  {
    "name": "Grotte di Postumia o Grotte di San Canziano",
    "location": "Postumia, Slovenia",
    "description": "Due capolavori sotterranei: Postumia offre un magico viaggio a bordo di un trenino tra stalattiti millenarie; San Canziano (UNESCO) stupisce con un canyon sotterraneo selvaggio e un ponte sospeso nel vuoto.",
    "image": "https://www.croazia.info/wp-content/uploads/sites/78/postumia-grotte-hd.jpg"
  },
  {
    "name": "Ljubljana Centro",
    "location": "Slovenia",
    "description": "Capitale verde ed elegante, caratterizzata da ponti pittoreschi, un castello che domina la città e un'atmosfera rilassata e giovane.",
    "image": "https://www.travelfar.it/wp-content/uploads/guida-di-lubiana-il-centro-e-il-fiume-di-notte.jpg"
  },
  {
    "name": "Metelkova Mesto",
    "location": "Ljubljana, Slovenia",
    "description": "Un vivace e alternativo centro di cultura autonoma situato in una ex caserma militare. Oggi è il cuore della street art di Lubiana, famoso per i suoi graffiti colorati, le sculture bizzarre e le gallerie d'arte indipendenti.",
    "image": "https://www.visitljubljana.com/assets/Foto-mreza-izbor/metelkova-2__ScaleMaxWidthWzE5MDBd.jpg"
  },
    {
    "name": "Terrazza Nebotičnik (Il Grattacielo)",
    "location": "Ljubljana, Slovenia",
    "description": "Storico edificio degli anni '30 dotato di un caffè all'ultimo piano. È il punto panoramico migliore di Lubiana, ideale per un aperitivo romantico mentre il tramonto illumina il castello.",
    "image": "https://kongres-magazine.eu/wp-content/uploads/2019/05/neboticnik-2.jpg?x97274"
  },
  {
    "name": "Lago di Bled",
    "location": "Slovenia",
    "description": "Un lago da fiaba con un'isola centrale sormontata da una chiesa e un castello medievale arroccato su una scogliera calcarea.",
    "image": "https://www.babytrekking.it/wordpress/wp-content/uploads/2020/05/Lago-di-Bled.jpg"
  },
  {
    "name": "Gola di Vintgar (Vintgar Gorge)",
    "location": "Dintorni di Bled, Slovenia",
    "description": "Una spettacolare gola naturale intagliata dal fiume Radovna. Si visita camminando su passerelle di legno sospese appena sopra acque turchesi e cristalline, fino alla cascata di Šum.",
    "image": "https://www.chicchediviaggio.it/wp-content/uploads/2019/01/gola-vintgar-passeggiata-natura-slovenia-1.jpg"
  }
];

  const packingList = {
    documents: [
      "Carta d'identità",
      "Patente",
      "Carta di credito",
      "Assicurazione viaggio (boh forse non ci serve devo informarmi)",
      "Prenotazioni hotel"
    ],
    clothing: [
      "Abbigliamento leggero",
      "Costume da bagno",
      "Scarpe comode",
      "Scarpe eleganti (ahahahah l'ai pensa che siamo tonti)",
      "Cappello",
      "Occhiali da sole"
    ],
    essentials: [
      "Caricabatterie",
      "Power bank",
      "iPhone",
      "Crema solare",
      "Farmaci personali",
      "Koalino",
      "Pikachino",
      "Koalotta"
    ]
  }

  const notes = [
    "Ricorda di controllare il meteo prima della partenza",
    "Porta contanti per le piccole spese",
    "Scarica le mappe offline",
    "Verifica i documenti di viaggio",
    "Ricorda che ti amo tanto"
  ]

  const typicalFoods = [
    // --- TRIESTE ---
    {
      "id": "ts_jota",
      "region": "Trieste, Italia",
      "name": "Jota",
      "description": "Una densa e saporita minestra della tradizione triestina e carsica, preparata con crauti (capuzi garbi), fagioli, patate e arricchita con costine o salsicce di maiale affumicate.",
      "image": "https://www.discover-trieste.it/proxyvfs.axd/img_full/r15714/file-jpg?v=14309&ext=.jpg"
    },
    {
      "id": "ts_goulash",
      "region": "Trieste, Italia",
      "name": "Gulash alla Triestina",
      "description": "Un ricco spezzatino di carne di manzo ereditato dall'Impero Austro-Ungarico, cotto lentamente per ore con un'altissima quantità di cipolle e generosamente speziato con paprika dolce.",
      "image": "https://www.casapappagallo.it/storage/20749/gulasch-triestino.jpg"
    },
    {
      "id": "ts_presnitz",
      "region": "Trieste, Italia",
      "name": "Presnitz",
      "description": "Dolce tipico triestino a forma di spirale, composto da una sfoglia sottilissima che racchiude un ricco ripieno di noci, mandorle, pinoli, uvetta, cioccolato e rum.",
      "image": "https://www.turismofvg.it/proxyvfs.axd/popup/r305766/file-jpg?v=369353&ext=.jpg"
    },

    // --- ISTRIA ---
    {
      "id": "ist_fusi_tartufo",
      "region": "Istria, Croazia",
      "name": "Fusi con Tartufo",
      "description": "La pasta fresca istriana per eccellenza (i fusi, ripiegati a fuso) servita con una vellutata salsa al tartufo bianco o nero, eccellenza assoluta delle foreste dell'entroterra istriano.",
      "image": "https://media-cdn.tripadvisor.com/media/photo-s/05/19/75/03/agriturismo-jadruhi.jpg"
    },
    {
      "id": "ist_peka",
      "region": "Istria, Croazia",
      "name": "Peka (Sotto la Campana)",
      "description": "Un metodo di cottura tradizionale in cui carne (solitamente polpo o agnello) e patate vengono cotte lentamente dentro una teglia di ferro coperta da una campana di ghisa, interrata sotto le braci vive.",
      "image": "https://www.braciamiancora.com/wp-content/uploads/2020/08/dalmatian-peka-scaled.jpg"
    },
    {
      "id": "ist_manestra",
      "region": "Istria, Croazia",
      "name": "Maneštra",
      "description": "Zuppa densa di verdure e legumi simile al minestrone, ma caratterizzata dalla cottura lenta insieme a un osso di prosciutto e dal 'pešt' (un trito di lardo, aglio e prezzemolo) che le dona un sapore unico.",
      "image": "https://chasingthedonkey.b-cdn.net/wp-content/uploads/2016/04/Croatian-Recipies-Istrian-Manestra.jpg"
    },

    // --- SLOVENIA ---
    {
      "id": "slo_struklji",
      "region": "Slovenia",
      "name": "Štruklji",
      "description": "Rotoli di pasta bolliti o cotti al forno con svariati ripieni. Versatili e onnipresenti nella cucina slovena, si trovano in versione salata (es. ricotta ed erbe) come contorno, o dolce (es. noci o dragoncello).",
      "image": "https://jernejkitchen.com/sites/default/files/styles/recipe_headerbreakpoints_theme_jernejkitchenr_screen-xl-min_2x/public/skutini-struklji-01c-jernejkitchen.jpg?itok=i9bBK3MJ&timestamp=1635941690"
    },
    {
      "id": "slo_kremsnita",
      "region": "Bled, Slovenia",
      "name": "Kremšnita",
      "description": "La celebre e soffice torta diplomatica simbolo del Lago di Bled: una base di pasta sfoglia croccante, un generoso strato di crema pasticcera alla vaniglia, uno strato di panna montata e sfoglia finale spolverata di zucchero a velo.",
      "image": "https://www.deabyday.tv/.imaging/default/article/guides/cucina-e-ricette/dolci/Come-si-fa-la-Kremsnite--un-dolce-dell-est/imageOriginal.jpg"
    },
    {
      "id": "slo_potica",
      "region": "Slovenia",
      "name": "Potica",
      "description": "Il dolce nazionale sloveno delle festività. È una gubana/rotolo di pasta lievitata farcito tradizionalmente con una crema ricca a base di noci tritate, miele e uvetta.",
      "image": "https://www.potica.com/wp-content/uploads/2025/04/Potica.jpg"
    }
  ]

  const getFoodsForDay = (day) => {
    if (day === 1) {
      // Giorno 1: viaggio Trieste -> Istria, mostra entrambe
      return typicalFoods.filter(food =>
        food.region.includes("Trieste") || food.region.includes("Istria")
      )
    } else if (day === 2 || day === 3) {
      // Giorni 2-3: solo Istria
      return typicalFoods.filter(food => food.region.includes("Istria"))
    } else if (day === 4) {
      // Giorno 4: viaggio Istria -> Slovenia, mostra entrambe
      return typicalFoods.filter(food =>
        food.region.includes("Istria") ||
        food.region.includes("Slovenia") ||
        food.region.includes("Bled")
      )
    } else if (day >= 5 && day <= 7) {
      // Giorni 5-6: solo Slovenia
      return typicalFoods.filter(food =>
        food.region.includes("Slovenia") || food.region.includes("Bled")
      )
    }
    return []
  }

  const handlePlaceClick = (placeName) => {
    const placeIndex = placesToVisit.findIndex(place =>
      place.name.toLowerCase().includes(placeName.toLowerCase()) ||
      placeName.toLowerCase().includes(place.name.toLowerCase().split('(')[0].trim().toLowerCase())
    )
    if (placeIndex !== -1) {
      setActiveSection('places')
      setTimeout(() => {
        const element = document.getElementById(`place-${placeIndex}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }

  const makeActivityClickable = (activity) => {
    const placeKeywords = [
      { name: 'Piazza Unità', displayName: 'Piazza Unità d\'Italia' },
      { name: 'Castello di Miramare', displayName: 'Castello di Miramare' },
      { name: 'Parenzo', displayName: 'Parenzo' },
      { name: 'Rovigno', displayName: 'Rovigno' },
      { name: 'Pola', displayName: 'Pola' },
      { name: 'Arena Romana', displayName: 'Arena Romana' },
      { name: 'Motovun', displayName: 'Motovun' },
      { name: 'Lubiana', displayName: 'Ljubljana Centro' },
      { name: 'Lago di Bled', displayName: 'Lago di Bled' },
      { name: 'Grotte di Postumia', displayName: 'Grotte di Postumia o Grotte di San Canziano' },
      { name: 'Castello di Predjama', displayName: 'Castello di Predjama' },
      { name: 'Gola di Vintgar', displayName: 'Gola di Vintgar (Vintgar Gorge)' },
      { name: 'Nebotičnik', displayName: 'Terrazza Nebotičnik (Il Grattacielo)' },
      { name: 'Metelkova Mesto', displayName: 'Metelkova Mesto' }
    ]

    let result = activity
    placeKeywords.forEach(({ name, displayName }) => {
      const regex = new RegExp(`(${name})`, 'gi')
      result = result.replace(regex, (match) => {
        return `<span class="inline-block bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded cursor-pointer hover:bg-rose-200 hover:text-rose-700 transition-colors border-b-2 border-rose-300" data-place="${displayName}">${match}</span>`
      })
    })

    return result
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Torna alla home</span>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-10 h-10 animate-pulse-slow" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Il Nostro Viaggio
            </h1>
          </div>
          
          <p className="text-xl text-white/90 mb-2">
            Trieste • Istria • Slovenia
          </p>
          <p className="text-white/80 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            3-9 Agosto 2026
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveSection('hotels')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeSection === 'hotels'
                ? 'bg-rose-500 text-white shadow-lg'
                : 'bg-white text-rose-600 hover:bg-rose-100'
            }`}
          >
            <Hotel className="w-4 h-4 inline mr-2" />
            Hotel
          </button>
          <button
            onClick={() => setActiveSection('itinerary')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeSection === 'itinerary'
                ? 'bg-rose-500 text-white shadow-lg'
                : 'bg-white text-rose-600 hover:bg-rose-100'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Itinerario
          </button>
          <button
            onClick={() => setActiveSection('places')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeSection === 'places'
                ? 'bg-rose-500 text-white shadow-lg'
                : 'bg-white text-rose-600 hover:bg-rose-100'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-2" />
            Luoghi da Visitare
          </button>
                    <button
            onClick={() => setActiveSection('foods')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeSection === 'foods'
                ? 'bg-rose-500 text-white shadow-lg'
                : 'bg-white text-rose-600 hover:bg-rose-100'
            }`}
          >
            <Utensils className="w-4 h-4 inline mr-2" />
            Cibi Tipici
          </button>
          <button
            onClick={() => setActiveSection('packing')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeSection === 'packing'
                ? 'bg-rose-500 text-white shadow-lg'
                : 'bg-white text-rose-600 hover:bg-rose-100'
            }`}
          >
            <Luggage className="w-4 h-4 inline mr-2" />
            Valigia
          </button>

          <button
            onClick={() => setActiveSection('notes')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeSection === 'notes'
                ? 'bg-rose-500 text-white shadow-lg'
                : 'bg-white text-rose-600 hover:bg-rose-100'
            }`}
          >
            <Edit3 className="w-4 h-4 inline mr-2" />
            Note
          </button>
        </div>

        {/* Content Sections */}
        <div className="animate-fade-in">
          {activeSection === 'hotels' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Hotel className="w-6 h-6 text-rose-500" />
                <h2 className="text-2xl font-bold text-rose-800">I Nostri Hotel</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="section-card">
                    <div className="aspect-video bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <img 
                        src={hotel.image} 
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = '<Hotel className="w-16 h-16 text-rose-300" />'
                        }}
                      />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-rose-800 mb-2">
                      {hotel.name}
                    </h3>
                    
                    <p className="text-rose-600 mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {hotel.location}
                    </p>
                    
                    <p className="text-rose-500 text-sm mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {hotel.dates}
                    </p>
                    
                    <p className="text-rose-700 text-sm mb-4 italic">
                      {hotel.notes}
                    </p>
                    
                    <div className="flex gap-2">
                      <a
                        href={hotel.bookingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-rose-500 text-white text-center py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Booking
                      </a>
                      <a
                        href={hotel.mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-pink-500 text-white text-center py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <MapPin className="w-4 h-4" />
                        Maps
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'itinerary' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-6 h-6 text-rose-500" />
                <h2 className="text-2xl font-bold text-rose-800">Il Nostro Itinerario</h2>
              </div>
              
              <div className="space-y-4">
                {itinerary.map((day) => (
                  <div key={day.day} className="section-card">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0">
                        {day.day}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <span className="text-rose-500 font-semibold text-sm sm:text-base">{day.date}</span>
                          <span className="text-rose-400 hidden sm:inline">•</span>
                          <span className="text-rose-800 font-semibold text-sm sm:text-base">{day.title}</span>
                        </div>
                        <ul className="space-y-2 sm:space-y-1">
                          {day.activities.map((activity, idx) => (
                            <li key={idx} className="text-rose-700 flex items-start gap-2 text-sm sm:text-base">
                              <Heart className="w-3 h-3 text-rose-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                              <span
                                className="break-words"
                                dangerouslySetInnerHTML={{ __html: makeActivityClickable(activity) }}
                                onClick={(e) => {
                                  const target = e.target.closest('[data-place]')
                                  if (target) {
                                    handlePlaceClick(target.dataset.place)
                                  }
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'places' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-rose-500" />
                <h2 className="text-2xl font-bold text-rose-800">Luoghi da Visitare</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {placesToVisit.map((place, index) => (
                  <div key={index} id={`place-${index}`} className="section-card scroll-mt-24">
                    <div className="aspect-video bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <img 
                        src={place.image} 
                        alt={place.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = '<Camera className="w-16 h-16 text-rose-300" />'
                        }}
                      />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-rose-800 mb-1">
                      {place.name}
                    </h3>
                    
                    <p className="text-rose-600 text-sm mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {place.location}
                    </p>
                    
                    <p className="text-rose-700 text-sm">
                      {place.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'packing' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Luggage className="w-6 h-6 text-rose-500" />
                <h2 className="text-2xl font-bold text-rose-800">Lista della Valigia</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="section-card">
                  <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Documenti
                  </h3>
                  <ul className="space-y-2">
                    {packingList.documents.map((item, idx) => (
                      <li key={idx} className="text-rose-700 flex items-center gap-2">
                        <Heart className="w-3 h-3 text-rose-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="section-card">
                  <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    Abbigliamento
                  </h3>
                  <ul className="space-y-2">
                    {packingList.clothing.map((item, idx) => (
                      <li key={idx} className="text-rose-700 flex items-center gap-2">
                        <Heart className="w-3 h-3 text-rose-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="section-card">
                  <h3 className="text-lg font-semibold text-rose-800 mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Essenziali
                  </h3>
                  <ul className="space-y-2">
                    {packingList.essentials.map((item, idx) => (
                      <li key={idx} className="text-rose-700 flex items-center gap-2">
                        <Heart className="w-3 h-3 text-rose-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'foods' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Utensils className="w-6 h-6 text-rose-500" />
                <h2 className="text-2xl font-bold text-rose-800">Cibi Tipici</h2>
              </div>

              {/* Day Selector */}
              <div className="section-card">
                <h3 className="text-lg font-semibold text-rose-800 mb-3">Seleziona il giorno dell'itinerario:</h3>
                <div className="flex flex-wrap gap-2">
                  {itinerary.map((day) => (
                    <button
                      key={day.day}
                      onClick={() => setSelectedFoodDay(day.day)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedFoodDay === day.day
                          ? 'bg-rose-500 text-white shadow-lg'
                          : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      }`}
                    >
                      Giorno {day.day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Foods Display */}
              <div className="space-y-4">
                {getFoodsForDay(selectedFoodDay).length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {getFoodsForDay(selectedFoodDay).map((food) => (
                      <div key={food.id} className="section-card">
                        <div className="aspect-video bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                          <img 
                            src={food.image} 
                            alt={food.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.parentElement.innerHTML = '<Utensils className="w-16 h-16 text-rose-300" />'
                            }}
                          />
                        </div>
                        
                        <h3 className="text-xl font-semibold text-rose-800 mb-1">
                          {food.name}
                        </h3>
                        
                        <p className="text-rose-600 text-sm mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {food.region}
                        </p>
                        
                        <p className="text-rose-700 text-sm">
                          {food.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="section-card text-center py-8">
                    <Utensils className="w-16 h-16 mx-auto text-rose-300 mb-4" />
                    <p className="text-rose-600">
                      Nessun piatto tipico disponibile per questo giorno
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'notes' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="w-6 h-6 text-rose-500" />
                <h2 className="text-2xl font-bold text-rose-800">Note Importanti</h2>
              </div>
              
              <div className="section-card">
                <ul className="space-y-3">
                  {notes.map((note, idx) => (
                    <li key={idx} className="text-rose-700 flex items-start gap-3">
                      <Heart className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="section-card bg-gradient-to-br from-rose-50 to-pink-50">
                <h3 className="text-lg font-semibold text-rose-800 mb-3 flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Info Viaggio in Macchina
                </h3>
                <p className="text-rose-700 mb-2">
                  Viaggeremo con la mia macchina. Ricorda di:
                </p>
                <ul className="space-y-2 text-rose-600">
                  <li className="flex items-center gap-2">
                    <Heart className="w-3 h-3" />
                    Controllare il livello del carburante
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="w-3 h-3" />
                    Portare il documento della macchina
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="w-3 h-3" />
                    Pianificare le tappe per il rifornimento
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-4 mt-12 text-center">
        <div className="flex justify-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <Heart key={i} className="w-5 h-5 text-rose-400 fill-rose-400" />
          ))}
        </div>
        <p className="text-rose-600">
          Un viaggio indimenticabile con la mia Marta 💖
        </p>
      </div>
    </div>
  )
}

export default TravelHome
