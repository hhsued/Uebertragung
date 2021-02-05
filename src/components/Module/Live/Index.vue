
<template lang="pug">
div
  Automatik(
    @Automatik="Automatik = $event",
    @Aufgabensammlung="Aufgabensammlung = $event"
  )
  div(style="margin-left: 10%; margin-right: 10%")
    .row
      Uebertragung
      Perspektiven
      Steuerung
      Kameras
      Mikrofone
  hr
  div(style="margin-left: 10%; margin-right: 10%")
    q-select(
      v-model="Vorgabe",
      label="Vorgabe für diese Übertragung",
      dense,
      :options="Vorgaben",
      @input="on_Vorgabe"
    )
      template(v-slot:after)
        q-btn(round, dense, flat, icon="refresh", @click="on_hole_Vorgaben")
  hr
  q-btn-toggle(
    @input="on_geaendert",
    style="margin-left: 10px; margin-right: 10px",
    spread,
    rounded,
    dense,
    unelevated,
    v-model="Komponente",
    toggle-color="primary",
    :options="Komponenten"
  )
  component(:is="Komponente", @Automatik_neu="on_Automatik_neu")
  div(v-if="$store.state.app.Fehlersuche")
    .text-h6 Automatik-Plan
    | {{ Planung }}
</template>

<script>
const lmodJoin = require('path').join

const lstrURL = 'https://ugd.hh-sued.de/uebertragungen.php'

import StartEnde from './Start_Ende/Start_Ende'
import Allgemein from './Allgemein/Allgemein'
import Textwort from './Textwort/Textwort'
import Personen from './Personen/Personen'
import Lieder from './Lieder/Lieder'
import Automatik from './Komponenten/Automatik'
import Perspektiven from './Komponenten/Perspektiven'
import Steuerung from './Komponenten/Steuerung'
import Kameras from './Komponenten/Kameras'
import Mikrofone from './Komponenten/Mikrofone'
import Uebertragung from './Komponenten/Übertragung'

export default {
  name: 'Live',
  components: { Lieder, Personen, Automatik, Textwort, Kameras, Mikrofone, Perspektiven, Steuerung, Allgemein, StartEnde, Uebertragung },
  data: () => ({
    Vorgaben: [],
    Vorgabe: null,
    Aufgaben: null,
    Szenen: {},
    Quellen: {},
    Planung: {},
    Funktion: null,
    Aufgabensammlung: null,
    Automatik: false,
    Komponente: 'StartEnde',
    Komponenten: [
      { label: 'Start / Ende', value: 'StartEnde' },
      { label: 'Allgemein', value: 'Allgemein' },
      { label: 'Textwort', value: 'Textwort' },
      { label: 'Personen', value: 'Personen' },
      { label: 'Lieder', value: 'Lieder' }
    ]
  }),
  watch: {
    Automatik: {
      immediate: true,
      handler (NeuerWert, AlterWert) {
        if (NeuerWert) {
          this.Automatik = true
          this.$store.commit('app/setze', { Automatik: true })
          this.Automatische_Verarbeitung()
        } else {
          this.Planung = {}
          clearInterval(this.Funktion)
        }
      }
    }
  },
  beforeMount () {

  },
  mounted () {
    this.on_hole_Vorgaben()
    this.Szenen = this.$E.Daten_laden('StartEnde', 'Szenen')
    this.Quellen = this.$E.Daten_laden('StartEnde', 'Quellen')

    /* if (!this.$store.state.app.Automatik) {
      this.$q.dialog({
        title: 'Automatik',
        message: 'Möchtest Du jetzt die Automatik einschalten?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.Automatik = true
      }).onCancel(() => {
        this.Automatik = false
      })
    } */
    const lobjDaten = this.$E.Sitzung_laden('Module')
    this.Komponente = lobjDaten.Komponente
    this.$OBS.Überblendung('setzen', 'Überblende')
  },
  methods: {
    async on_Vorgabe () {
      const lobjResponse = await fetch(lstrURL + '?Aktion=Vorgabe&Vorgabe=' + this.Vorgabe, {})
      this.$store.commit('Steuerung/setzeVorgabe', await lobjResponse.json())
    },
    async on_hole_Vorgaben () {
      const lobjResponse = await fetch(lstrURL + '?Aktion=Vorgaben', {})
      this.Vorgaben = await lobjResponse.json()
      this.$q.notify('Vorgaben vom Server geladen')
    },
    on_Automatik_neu () {
      if (this.Automatik) {
        this.Planung = {}
        this.Funktion = null
        this.Automatik = true
        this.$store.commit('app/setze', { Automatik: true })
        this.Automatische_Verarbeitung()
      }
    },
    on_geaendert () {
      this.$E.Sitzung_speichern('Module', { Komponente: this.Werte.Komponente })
    },
    Planungspruefung (Uhrzeit) {
      if (this.Planung[Uhrzeit[0]] === undefined) {
        this.Planung[Uhrzeit[0]] = {}
        this.Planung[Uhrzeit[0]][Uhrzeit[1]] = []
      }
      if (this.Planung[Uhrzeit[0]] !== undefined) {
        if (this.Planung[Uhrzeit[0]][Uhrzeit[1]] === undefined) {
          this.Planung[Uhrzeit[0]][Uhrzeit[1]] = []
        }
      }
    },
    Aufgabe_eintragen (Zeit, Aufgabe) {
      this.Planung[Zeit[0]][Zeit[1]].push(Aufgabe)
    },
    Aufgabe_Zeit (Aufgabe, Zeitname) {
      const larrZeitpunkt = this.Aufgaben[Aufgabe][Zeitname].split(':')
      larrZeitpunkt[0] = parseInt(larrZeitpunkt[0])
      larrZeitpunkt[1] = parseInt(larrZeitpunkt[1])
      return larrZeitpunkt
    },
    Aufgabe_Zeitpunkt (Aufgabe) {
      if (this.Aufgaben[Aufgabe].Aktiv) {
        const larrZeitpunkt = this.Aufgabe_Zeit(Aufgabe, 'Zeitpunkt')
        const lintMinute = new Date().getMinutes()
        const lintStunde = new Date().getHours()
        if (lintStunde === larrZeitpunkt[0]) {
          if (lintMinute > larrZeitpunkt[1]) {
            this.on_Aufgabe(Aufgabe)
          } else {
            this.Planungspruefung(larrZeitpunkt)
            this.Aufgabe_eintragen(larrZeitpunkt, Aufgabe)
          }
        } else {
          this.Planungspruefung(larrZeitpunkt)
          this.Aufgabe_eintragen(larrZeitpunkt, Aufgabe)
        }
      }
    },
    Aufgabe_Countdown_aufbauen () {
      const larrStartzeit = this.Aufgabe_Zeit('Countdown', 'Startzeit')
      const larrZielzeit = this.Aufgabe_Zeit('Countdown', 'Zielzeit')
      let lboolAufgabePlanen = true
      if (larrStartzeit[0] > larrZielzeit[0]) {
        this.$q.notify('Countdown: Die Startzeit ist größer als die Zielzeit -> Startzeit: ' + larrStartzeit + ', Zielzeit -> ' + larrZielzeit)
        lboolAufgabePlanen = false
      } else if (larrStartzeit[0] === larrZielzeit[0]) {
        if (larrStartzeit[1] > larrZielzeit[1]) {
          this.$q.notify('Countdown: Die Startzeit ist größer als die Zielzeit -> Startzeit: ' + larrStartzeit + ', Zielzeit -> ' + larrZielzeit)
          lboolAufgabePlanen = false
        }
      }

      if (lboolAufgabePlanen) {
        for (let lintStunde = larrStartzeit[0]; lintStunde <= larrZielzeit[0]; lintStunde++) {
          if (lintStunde === larrZielzeit[0]) {
            for (let lintMinute = larrStartzeit[1]; lintMinute <= larrZielzeit[1]; lintMinute++) {
              this.Planungspruefung([lintStunde, lintMinute])
              this.Aufgabe_eintragen([lintStunde, lintMinute], 'Countdown')
            }
          }
          if (lintStunde < larrZielzeit[0]) {
            for (let lintMinute = larrStartzeit[1]; lintMinute <= 59; lintMinute++) {
              this.Planungspruefung([lintStunde, lintMinute])
              this.Aufgabe_eintragen([lintStunde, lintMinute], 'Countdown')
            }
            larrStartzeit[1] = 0
          }
        }
      }
    },
    Aufgabe_Sondereinblendung_aufbauen_naechste_Aktion (SondereinblendungSichtbar, NaechsteAktion) {
      if (SondereinblendungSichtbar) {
        NaechsteAktion[1] += this.Aufgaben.Sondereinblendung.Länge
        if (NaechsteAktion[1] === 60) {
          NaechsteAktion[0]++
          NaechsteAktion[1] = 0
        }
      } else {
        NaechsteAktion[1] += (this.Aufgaben.Sondereinblendung.Intervall - this.Aufgaben.Sondereinblendung.Länge)
        if (NaechsteAktion[1] === 60) {
          NaechsteAktion[0]++
          NaechsteAktion[1] = 0
        }
      }
      return NaechsteAktion
    },
    Aufgabe_Sondereinblendung_aufbauen () {
      const larrStartzeit = this.Aufgabe_Zeit('Sondereinblendung', 'Startzeit')
      const larrZielzeit = this.Aufgabe_Zeit('Sondereinblendung', 'Endzeit')
      let larrNaechsteAktion = [larrStartzeit[0], larrStartzeit[1]]
      let lboolSondereinblendungSichtbar = false

      this.Planungspruefung(larrStartzeit)
      this.Aufgabe_eintragen(larrStartzeit, 'Sondereinblendung')
      lboolSondereinblendungSichtbar = true
      larrNaechsteAktion = this.Aufgabe_Sondereinblendung_aufbauen_naechste_Aktion(lboolSondereinblendungSichtbar, larrNaechsteAktion)
      for (let lintStunde = larrStartzeit[0]; lintStunde <= larrZielzeit[0]; lintStunde++) {
        if (lintStunde === larrZielzeit[0]) {
          for (let lintMinute = larrStartzeit[1]; lintMinute <= larrZielzeit[1]; lintMinute++) {
            if (lintStunde === larrNaechsteAktion[0]) {
              if (lintMinute === larrNaechsteAktion[1]) {
                this.Planungspruefung([lintStunde, lintMinute])
                this.Aufgabe_eintragen([lintStunde, lintMinute], 'Sondereinblendung')
                lboolSondereinblendungSichtbar = !lboolSondereinblendungSichtbar
                larrNaechsteAktion = this.Aufgabe_Sondereinblendung_aufbauen_naechste_Aktion(lboolSondereinblendungSichtbar, larrNaechsteAktion)
              }
            }
          }
        }
        if (lintStunde < larrZielzeit[0]) {
          for (let lintMinute = larrStartzeit[1]; lintMinute <= 59; lintMinute++) {
            if (lintStunde === larrNaechsteAktion[0]) {
              if (lintMinute === larrNaechsteAktion[1]) {
                this.Planungspruefung([lintStunde, lintMinute])
                this.Aufgabe_eintragen([lintStunde, lintMinute], 'Sondereinblendung')
                lboolSondereinblendungSichtbar = !lboolSondereinblendungSichtbar
                larrNaechsteAktion = this.Aufgabe_Sondereinblendung_aufbauen_naechste_Aktion(lboolSondereinblendungSichtbar, larrNaechsteAktion)
              }
            }
          }
          larrStartzeit[1] = 0
        }
      }

      if (lboolSondereinblendungSichtbar) {
        this.Planungspruefung([larrZielzeit[0], larrZielzeit[1] + this.Aufgaben.Sondereinblendung.Länge])
        this.Aufgabe_eintragen([larrZielzeit[0], larrZielzeit[1] + this.Aufgaben.Sondereinblendung.Länge], 'Sondereinblendung')
      }
    },
    Aufgaben_aufbauen () {
      this.Aufgaben = this.$E.laden(this.Aufgabensammlung, lmodJoin(process.cwd(), 'Daten', 'Aufgaben'))
      // Starten
      this.Aufgabe_Zeitpunkt('Starten')
      // Countdown
      if (this.Aufgaben.Countdown.Aktiv) {
        this.Aufgabe_Countdown_aufbauen()
      }
      // Sondereinblendung
      if (this.Aufgaben.Sondereinblendung.Aktiv) {
        this.Aufgabe_Sondereinblendung_aufbauen()
      }
      // Vorspann
      this.Aufgabe_Zeitpunkt('Vorspann')
      // Sichtbar
      this.Aufgabe_Zeitpunkt('Sichtbar')
      // Unsichtbar
      this.Aufgabe_Zeitpunkt('Unsichtbar')
      // Automatik aus
      this.Aufgabe_Zeitpunkt('Automatik_aus')

      this.$q.notify('Automatikzeitplan aufgebaut!')
      console.log(this.Planung)
    },
    Automatische_Verarbeitung () {
      if (Object.keys(this.Planung).length === 0) {
        this.Aufgaben_aufbauen()
      }
      this.Aufgabe_ausfuehren()
      this.Funktion = setInterval(() => {
        if (this.$store.state.app.Fehlersuche) {
          this.$q.notify('Bin in der Intervall-Funktion')
        }
        this.Aufgabe_ausfuehren()
      }, 60000) // 60000
    },
    Aufgabe_ausfuehren () {
      const lintMinute = new Date().getMinutes()
      const lintStunde = new Date().getHours()
      if (this.$store.state.app.Fehlersuche) {
        this.$q.notify('lintStunde = ' + lintStunde + ', lintMinute = ' + lintMinute)
      }

      if (this.Planung[lintStunde] !== undefined && this.Planung[lintStunde][lintMinute] !== undefined && this.Planung[lintStunde][lintMinute].length > 0) {
        if (this.$store.state.app.Fehlersuche) {
          this.$q.notify('Ich habe etwas gefunden')
        }
        this.Planung[lintStunde][lintMinute].forEach(lstrAufgabe => {
          if (this.$store.state.app.Fehlersuche) {
            this.$q.notify('Aufgabe: ' + lstrAufgabe)
          }
          this.on_Aufgabe(lstrAufgabe)
        })
      }
    },
    Aufgabe_Countdown () {
      if (!this.$OBS.Verbindung()._connected) {
        this.$q.notify('Konnte die Aufgabe nicht ausführen, da keine Verbindung zum OBS besteht!')
        return
      }
      let lstrText = ''
      const larrZielzeit = this.Aufgabe_Zeit('Countdown', 'Zielzeit')

      const lintMinuten = ((larrZielzeit[0] * 60) + larrZielzeit[1]) - ((new Date().getHours() * 60) + new Date().getMinutes())
      const lstrMinutenText = (lintMinuten > 1) ? 'Minuten' : 'Minute'

      if (lintMinuten > 0) {
        lstrText = 'Start der Übertragung in ' +
          lintMinuten.toString() + ' ' + lstrMinutenText
      }
      if (lintMinuten === 0) {
        lstrText = 'Start der Übertragung'
      }
      this.$OBS.Text(
        this.Quellen.Anfang_Übertragungsstart,
        lstrText,
        70,
        'Arial'
      )
      this.$OBS.Sichtbarkeit(this.Szenen.Warten, this.Quellen.Anfang_Übertragungsstart, true)
      this.$q.notify('Aufgabe: Countdown wurde aktualisiert')
    },
    async Aufgabe_Sondereinblendung () {
      if (!this.$OBS.Verbindung()._connected) {
        this.$q.notify('Konnte die Aufgabe nicht ausführen, da keine Verbindung zum OBS besteht!')
        return
      }
      const lobjAktuelleSzene = await this.$OBS.Szene('Aktuelle')
      if (lobjAktuelleSzene.name === this.Szenen.Sondereinblendung) {
        this.$OBS.Szene('Vorschau', this.Szenen.Warten)
        this.$OBS.Szene('Live', this.Szenen.Warten, 3000)
        this.$q.notify('Aufgabe: Sondereinblendung wurde ausgeblendet')
      } else {
        this.$OBS.Szene('Vorschau', this.Szenen.Sondereinblendung)
        this.$OBS.Szene('Live', this.Szenen.Sondereinblendung, 3000)
        this.$q.notify('Aufgabe: Sondereinblendung wurde eingeblendet')
      }
    },
    Aufgabe_Vorspann () {
      if (!this.$OBS.Verbindung()._connected) {
        this.$q.notify('Konnte die Aufgabe nicht ausführen, da keine Verbindung zum OBS besteht!')
        return
      }
      this.$OBS.Szene('Vorschau', this.Szenen.Vorspann)
      this.$OBS.Szene('Live', this.Szenen.Vorspann, 3000)
      setTimeout(() => {
        this.Aufgabe_Live()
      }, 25000)
      this.$q.notify('Aufgabe: Vorspann starten wurde ausgeführt')
    },
    Aufgabe_Live () {
      if (!this.$OBS.Verbindung()._connected) {
        this.$q.notify('Konnte die Aufgabe nicht ausführen, da keine Verbindung zum OBS besteht!')
        return
      }
      this.$OBS.Sichtbarkeit(this.Szenen.Live, this.Quellen.Livekamera, true)
      if (typeof (this.Quellen.Liveton) !== 'string') {
        this.Quellen.Liveton.forEach(lstrTon => {
          this.$OBS.Sichtbarkeit(this.Szenen.Live, lstrTon, true)
        })
      } else {
        this.$OBS.Sichtbarkeit(this.Szenen.Live, this.Quellen.Liveton, true)
      }

      this.$OBS.Szene('Vorschau', this.Szenen.Live)
      this.$OBS.Szene('Live', this.Szenen.Live, 3000)
      this.$q.notify('Aufgabe: Livebild einblenden wurde ausgeführt')
    },
    Aufgabe_sichtbar () {
      if (!this.$store.state.app.YouTubeID) {
        this.$q.notify('Es wurde keine passende YouTube-Übertragung für heute gefunden. Kann den Befehl nicht ausführen!')
        return
      }
      this.$YT.Schalter(this.$store.state.app.YouTubeID, 'public')
      this.$q.notify('Aufgabe: YouTube-Übertragung auf \'sichtbar\' setzen wurde ausgeführt')
    },
    Aufgabe_unsichtbar () {
      if (!this.$store.state.app.YouTubeID) {
        this.$q.notify('Es wurde keine passende YouTube-Übertragung für heute gefunden. Kann den Befehl nicht ausführen!')
        return
      }
      this.$YT.Schalter(this.$store.state.app.YouTubeID, 'unlisted')
      this.$q.notify('Aufgabe: YouTube-Übertragung auf \'unsichtbar\' setzen wurde ausgeführt')
    },
    on_Aufgabe (Aufgabe) {
      switch (Aufgabe) {
        case 'Starten':
          this.$OBS.Stream('starten')
          this.$store.commit('app/setze', { Übertragung_läuft: true })
          this.$q.notify('Aufgabe: Die Übertragung wurde gestartet')
          break
        case 'Countdown':
          this.Aufgabe_Countdown()
          // this.Aufgabe_Sondereinblendung()
          break
        case 'Sondereinblendung':
          this.Aufgabe_Sondereinblendung()
          break
        case 'Vorspann':
          this.Aufgabe_Vorspann()
          break
        case 'Live':
          this.Aufgabe_Live()
          break
        case 'Sichtbar':
          this.Aufgabe_sichtbar()
          break
        case 'Unsichtbar':
          this.Aufgabe_unsichtbar()
          break
        case 'Automatik_aus':
          this.$store.commit('app/setze', { Automatik: false })
          this.Planung = {}
          clearInterval(this.Funktion)
          this.$q.notify('Aufgabe: Die Automatik wurde deaktiviert')
          break
      }
    }
  }
}
</script>
