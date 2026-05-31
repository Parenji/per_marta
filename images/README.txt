Questa cartella deve contenere le seguenti immagini per la web app:

HOTEL (3 immagini):
- hotel1.jpg - Primo hotel (Istria, 3-5 Agosto)
- hotel2.jpg - Secondo hotel (Slovenia, 5-7 Agosto)
- hotel3.jpg - Terzo hotel (Trieste, 7-9 Agosto)

LUOGHI DA VISITARE (6 immagini):
# Asset Immagini - Itinerario Padova, Istria e Slovenia

Questo documento mappa i nuovi percorsi locali delle immagini utilizzati nell'array `placesToVisit`. Le vecchie definizioni generiche sono state sostituite con nomi di file specifici, puliti e semantici per facilitare l'integrazione degli asset grafici nel front-end.

## Mappatura degli Indirizzi Locali

| Nome Luogo | Posizione Geografica | Percorso File Immagine (`image`) | Note sul Contenuto Visivo |
| :--- | :--- | :--- | :--- |
| **Trieste - Piazza Unità d'Italia** | Friuli-Venezia Giulia, Italia | `/images/trieste_piazza_unita.jpg` | Vista panoramica della piazza aperta sul mare Adriatico. |
| **Castello di Miramare** | Trieste, Italia | `/images/castello_miramare.jpg` | Facciata del castello bianco vista dal mare o dai giardini. |
| **Rovigno (Rovinj)** | Istria, Croazia | `/images/rovigno_centro.jpg` | Scorcio del borgo marinaro con le case colorate e il campanile. |
| **Pola - Arena Romana** | Istria, Croazia | `/images/pola_arena.jpg` | Esterno o interno dell'Anfiteatro Romano sotto la luce diurna. |
| **Motovun (Montona)** | Istria, Croazia | `/images/motovun_borgo.jpg` | Profilo del borgo medievale arroccato sulla collina avvolto dalla nebbia o sotto il sole. |
| **Ljubljana Centro** | Slovenia | `/images/lubiana_centro.jpg` | Vista del Triplo Ponte (Tromostovje) o del lungofiume Ljubljanica. |
| **Lago di Bled** | Slovenia | `/images/lago_bled.jpg` | Inquadratura classica con il lago, l'isola centrale e la chiesa. |

## Linee guida per lo sviluppatore
1. Assicurati di salvare i file immagine all'interno della cartella pubblica del progetto nel percorso `/images/`.
2. Si consiglia di ottimizzare le immagini in formato `.jpg` o `.webp` con una risoluzione adatta al web (es. 1200x800px) per garantire un caricamento rapido della pagina dell'itinerario.

Nota: Se non inserisci le immagini, l'app mostrerà automaticamente dei placeholder con icone.
