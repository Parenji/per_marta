# 💖 30 Anni di Marta - Web App

Una web app romantica per festeggiare i 30 anni di Marta, con un bigliettino d'amore e l'organizzazione del viaggio in Istria, Slovenia e Trieste.

## 🚀 Come avviare

1. Installa le dipendenze:
```bash
npm install
```

2. Avvia il server di sviluppo:
```bash
npm run dev
```

3. Apri il browser all'URL mostrato (solitamente http://localhost:5173)

## 📁 Struttura del progetto

- `/src/pages/Landing.jsx` - Pagina iniziale con i due link di ingresso
- `/src/pages/GreetingCard.jsx` - Bigliettino d'amore per Marta
- `/src/pages/TravelHome.jsx` - Pagina di organizzazione del viaggio
- `/images/` - Cartella per le immagini (vedi sotto)

## 🖼️ Immagini

La web app si aspetta le seguenti immagini nella cartella `/images/`:

### Hotel (3 immagini)
- `hotel1.jpg` - Primo hotel (Istria)
- `hotel2.jpg` - Secondo hotel (Slovenia)
- `hotel3.jpg` - Terzo hotel (Trieste)

### Luoghi da visitare (6 immagini)
- `pula.jpg` - Arena Romana di Pula
- `rovinj.jpg` - Rovinj
- `ljubljana.jpg` - Ljubljana
- `bled.jpg` - Lago di Bled
- `trieste.jpg` - Piazza Unità a Trieste
- `miramare.jpg` - Castello di Miramare

**Nota:** Se non inserisci le immagini, l'app mostrerà automaticamente dei placeholder con icone.

## ✏️ Personalizzazione

### Modificare il messaggio d'amore
Apri `/src/pages/GreetingCard.jsx` e modifica il testo nel componente. Puoi cambiare:
- Il titolo
- Il messaggio principale
- La firma

### Modificare gli hotel
Apri `/src/pages/TravelHome.jsx` e cerca l'array `hotels`. Modifica:
- `name` - Nome dell'hotel
- `location` - Città/località
- `dates` - Date del soggiorno
- `bookingLink` - Link a Booking.com
- `mapsLink` - Link a Google Maps
- `notes` - Note aggiuntive

### Modificare l'itinerario
Nello stesso file, cerca l'array `itinerary`. Puoi modificare:
- Le date
- I titoli dei giorni
- Le attività di ogni giorno

### Modificare i luoghi da visitare
Cerca l'array `placesToVisit` per modificare:
- Nome del luogo
- Località
- Descrizione

### Modificare la lista della valigia
Cerca l'oggetto `packingList` per personalizzare le liste di:
- Documenti
- Abbigliamento
- Essenziali

### Modificare le note
Cerca l'array `notes` per aggiungere o modificare le note importanti.

## 🎨 Tema

L'app usa un tema amore con colori rosa e rosso. Puoi modificare i colori in `/tailwind.config.js` se vuoi cambiare il tema.

## 📦 Build per produzione

Per creare una versione di produzione:
```bash
npm run build
```

I file buildati saranno nella cartella `/dist`.

## 💻 Tecnologie utilizzate

- React 18
- Vite
- TailwindCSS
- React Router
- Lucide React (icone)

## 💌 Note

- L'app è completamente responsive e funziona su mobile e desktop
- Le animazioni sono leggere e fluide
- Il design è moderno e romantico
- Puoi facilmente personalizzare ogni parte del contenuto

Buon compleanno Marta! 💖
