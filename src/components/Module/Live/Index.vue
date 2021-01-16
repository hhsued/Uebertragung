
<template lang="pug">
div
  Automatik(@Automatik="Automatik = $event")
  div(style="margin-left: 10%; margin-right: 10%")
    .row
      Uebertragung
      Perspektiven
      Steuerung
      Kameras
      Mikrofone
  hr
  q-btn-toggle(
    @input="on_geaendert"
    style="margin-left: 10px; margin-right: 10px;"
    spread,
    rounded,
    unelevated,
    v-model="Komponente",
    toggle-color="primary",
    :options="Komponenten"
    )

  component(:is="Komponente" @Automatik_neu="on_Automatik_neu")
</template>

<script>
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
    Aufgaben: null,
    Szenen: {},
    Quellen: {},
    Planung: {},
    Funktion: null,
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
    this.Szenen = this.$E.Daten_laden('StartEnde', 'Szenen')
    this.Quellen = this.$E.Daten_laden('StartEnde', 'Quellen')
    this.Aufgaben = this.$E.laden('Aufgaben')
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
    on_Automatik_neu () {
      this.Aufgaben = this.$E.laden('Aufgaben')
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
    Aufgaben_aufbauen () {
      const aktuelleMinute = new Date().getMinutes()
      let lintZähler = 1
      for (let lintMinute = aktuelleMinute; lintMinute <= 59; lintMinute++) {
        if (this.Planung[lintMinute] === undefined || lintMinute === 0) {
          this.Planung[lintMinute] = []
        }
        Object.keys(this.Aufgaben).forEach(lstrAufgabe => {
          if (this.Aufgaben[lstrAufgabe].Status === 'Aktiv') {
            switch (this.Aufgaben[lstrAufgabe].Typ) {
              case 'Intervall_begrenzt':
                if (this.Aufgaben[lstrAufgabe].Nächster === lintZähler) {
                  if (typeof (this.Aufgaben[lstrAufgabe].Ende) !== 'number') {
                    this.Aufgaben[lstrAufgabe].Ende = parseInt(this.Aufgaben[lstrAufgabe].Ende)
                  }
                  if (this.Aufgaben[lstrAufgabe].Ende !== undefined) {
                    if (lintMinute <= this.Aufgaben[lstrAufgabe].Ende) {
                      this.Planung[lintMinute].push(lstrAufgabe)
                      this.Aufgaben[lstrAufgabe].Nächster = this.Aufgaben[lstrAufgabe].Nächster + this.Aufgaben[lstrAufgabe].Intervall
                      if (this.Aufgaben[lstrAufgabe].Länge !== undefined) {
                        this.Planung[lintMinute + this.Aufgaben[lstrAufgabe].Länge] = []
                        this.Planung[lintMinute + this.Aufgaben[lstrAufgabe].Länge].push(lstrAufgabe)
                      }
                    }
                  } else {
                    this.Planung[lintMinute].push(lstrAufgabe)
                    this.Aufgaben[lstrAufgabe].Nächster = this.Aufgaben[lstrAufgabe].Nächster + this.Aufgaben[lstrAufgabe].Intervall
                    if (this.Aufgaben[lstrAufgabe].Länge !== undefined) {
                      this.Planung[lintMinute + this.Aufgaben[lstrAufgabe].Länge] = []
                      this.Planung[lintMinute + this.Aufgaben[lstrAufgabe].Länge].push(lstrAufgabe)
                    }
                  }
                }
                break
              case 'Zeitpunkt':
                if (lintMinute === parseInt(this.Aufgaben[lstrAufgabe].Zeitpunkt)) {
                  this.Planung[lintMinute].push(lstrAufgabe)
                }
                break
            }
          }
        })
        lintZähler++
      }
      this.$q.notify('Automatikzeitplan aufgebaut!')
    },
    Automatische_Verarbeitung () {
      if (Object.keys(this.Planung).length === 0) {
        this.Aufgaben_aufbauen()
        for (let lintMinutenZähler = 0; lintMinutenZähler < new Date().getMinutes(); lintMinutenZähler++) {
          if (this.Planung[lintMinutenZähler] !== undefined && this.Planung[lintMinutenZähler].length > 0) {
            this.Planung[lintMinutenZähler].forEach(lstrAufgabe => {
              if (lstrAufgabe !== 'Automatik_aus') {
                this.on_Aufgabe(lstrAufgabe)
              }
            })
          }
        }
      }
      if (new Date().getMinutes() === 0) {
        this.Aufgaben_aufbauen()
      }
      this.Aufgabe_ausfuehren()
      this.Funktion = setInterval(() => {
        this.Aufgabe_ausfuehren()
      }, 60000) // 60000
    },
    Aufgabe_ausfuehren () {
      const lintMinute = new Date().getMinutes()
      if (this.Planung[lintMinute] !== undefined && this.Planung[lintMinute].length > 0) {
        this.Planung[lintMinute].forEach(lstrAufgabe => {
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
      if (typeof (this.Aufgaben.Countdown.Ende) !== 'number') {
        this.Aufgaben.Countdown.Ende = parseInt(this.Aufgaben.Countdown.Ende)
      }
      const lintMinuten = this.Aufgaben.Countdown.Ende - new Date().getMinutes()
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
