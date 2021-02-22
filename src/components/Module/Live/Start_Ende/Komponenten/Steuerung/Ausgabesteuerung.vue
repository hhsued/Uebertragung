<template lang="pug">
div
  div(style="margin-left: 10%; margin-right: 10%")
    .row
      .col
        q-card
          q-card-section(style="padding: 0px")
            .text-h6.text-center Warten
          q-separator
          q-card-section
            q-btn.full-width(
              icon="play_arrow",
              unelevated,
              @click="on_Aktion('Live')",
              dense
            )
              q-tooltip Übergang mit Änderungen
            q-btn.full-width(
              icon="visibility",
              unelevated,
              @click="on_Aktion('Vorschau')",
              dense
            )
              q-tooltip Vorschau
      .col
        q-card
          q-card-section(style="padding: 0px")
            .text-h6.text-center Ende
          q-separator
          q-card-section
            q-btn.full-width(
              icon="play_arrow",
              @click="on_Ende('Live')",
              unelevated,
              dense
            )
              q-tooltip Übergang mit Änderungen
            q-btn.full-width(
              icon="visibility",
              @click="on_Ende('Vorschau')",
              unelevated,
              dense
            )
              q-tooltip Vorschau
      .col
        q-card
          q-card-section(style="padding: 0px")
            .text-h6.text-center Übertragung
          q-separator
          q-card-section
            q-btn.full-width(
              icon="done",
              @click="Stream('starten')",
              unelevated,
              dense
            )
              q-tooltip Starten
            q-btn.full-width(
              icon="close",
              @click="Stream('beenden')",
              unelevated,
              dense
            )
              q-tooltip Beenden
      .col
        q-card
          q-card-section(style="padding: 0px")
            .text-h6.text-center YouTube
          q-separator
          q-card-section(style="padding: 0px")
            q-btn.full-width(
              icon="ondemand_video",
              unelevated,
              @click="YouTube('sichtbar')",
              dense
            )
              q-tooltip YouTube sichtbar
            q-btn.full-width(
              icon="personal_video",
              unelevated,
              @click="YouTube('unsichtbar')",
              dense
            )
              q-tooltip YouTube UNsichtbar
            q-btn.full-width(
              icon="videocam_off",
              unelevated,
              @click="YouTube('privat')",
              dense
            )
              q-tooltip YouTube privat
</template>

<script>
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: ['Taste'],
  components: {},
  data: () => ({
    Standardperspektive: false
  }),
  // ShiftStrgKeyS
  watch: {
  },
  mounted () {
  },
  methods: {
    YouTube (Aktion) {
      if (!this.$store.state.app.YouTubeID) {
        this.$q.notify('Es wurde keine passende YouTube-Übertragung für heute gefunden. Kann den Befehl nicht ausführen!')
        return
      }
      switch (Aktion) {
        case 'sichtbar':
          this.$YT.Schalter(this.$store.state.app.YouTubeID, 'public')
          this.$q.notify('Manuell auf SICHTBAR geschaltet')
          break
        case 'unsichtbar':
          this.$YT.Schalter(this.$store.state.app.YouTubeID, 'unlisted')
          this.$q.notify('Manuell auf UNsichtbar geschaltet')
          break
        case 'privat':
          this.$YT.Schalter(this.$store.state.app.YouTubeID, 'private')
          this.$q.notify('Manuell auf PRIVAT geschaltet')
          break
      }
    },
    Stream (Aktion) {
      if (this.$OBS.Verbindung()._connected) {
        switch (Aktion) {
          case 'starten':
            this.$store.commit('app/setze', { Übertragung_läuft: true })
            break
          case 'beenden':
            this.$store.commit('app/setze', { Übertragung_läuft: false })
            break
        }
        this.$OBS.Stream(Aktion)
      } else {
        this.$q.notify('Nicht mit OBS verbunden!')
      }
    },
    Stellen (Sollanzahl, Wert) {
      let lstrWert = ''
      Wert = Wert.toString()

      if (Wert.length < Sollanzahl) {
        for (let lintZaehler = 0; lintZaehler < Sollanzahl - 1; lintZaehler++) {
          lstrWert += '0'
        }
      }
      return lstrWert + Wert
    },
    on_Aktion (Aktion) {
      const larrSzenen = this.$E.Daten_laden('StartEnde', 'Szenen')
      const larrQuellen = this.$E.Daten_laden('StartEnde', 'Quellen')

      const lobjAnsichtskonfiguration = []

      if (this.$store.state.StartEnde.Art !== 'ohne') {
        lobjAnsichtskonfiguration.push({
          Typ: 'Text',
          Szene: larrSzenen.Warten,
          Quelle: larrQuellen.Anfang_Gottesdienstart,
          Text: this.$store.state.StartEnde.Art,
          Schriftgröße: 150,
          Schriftart: 'Arial',
          Kontur: false
        })
      } else {
        this.$OBS.Sichtbarkeit(larrSzenen.Warten, larrQuellen.Anfang_Gottesdienstart, false)
      }

      if (this.$store.state.StartEnde.Datum) {
        lobjAnsichtskonfiguration.push(
          {
            Typ: 'Text',
            Quelle: larrQuellen.Anfang_Datum,
            Szene: larrSzenen.Warten,
            Text: this.Stellen(2, new Date().getDate()) + '.' + this.Stellen(2, new Date().getMonth() + 1) + '.' + this.Stellen(4, new Date().getFullYear()),
            Schriftgröße: 150,
            Schriftart: 'Arial',
            Kontur: false
          }
        )
      } else {
        this.$OBS.Sichtbarkeit(larrSzenen.Warten, larrQuellen.Anfang_Datum, false)
      }
      if (this.$store.state.StartEnde.Hinweis) {
        lobjAnsichtskonfiguration.push(
          {
            Typ: 'Text',
            Quelle: larrQuellen.Anfang_Starthinweise,
            Szene: larrSzenen.Warten,
            Text: this.$store.state.StartEnde.Hinweistext,
            Schriftgröße: 60,
            Schriftart: 'Arial',
            Kontur: false
          }
        )
      } else {
        this.$OBS.Sichtbarkeit(larrSzenen.Warten, larrQuellen.Anfang_Starthinweise, false)
      }
      if (this.$store.state.StartEnde.Startuhrzeit) {
        if (this.$store.state.StartEnde.Startzeit !== '') {
          lobjAnsichtskonfiguration.push(
            {
              Typ: 'Text',
              Quelle: larrQuellen.Anfang_Beginn,
              Szene: larrSzenen.Warten,
              Text: 'Beginn: ' + this.$store.state.StartEnde.Startzeit,
              Schriftgröße: 90,
              Schriftart: 'Arial',
              Kontur: false
            }
          )
        } else {
          this.$OBS.Sichtbarkeit(larrSzenen.Warten, larrQuellen.Anfang_Beginn, false)
        }
      } else {
        this.$OBS.Sichtbarkeit(larrSzenen.Warten, larrQuellen.Anfang_Beginn, false)
      }

      this.$Helfer.Aktionen(
        Aktion,
        larrSzenen.Warten,
        'StartEnde',
        this.Standardperspektive,
        this.$store,
        lobjAnsichtskonfiguration)
    },
    on_Ende (Modus) {
      const larrSzenen = this.$E.Daten_laden('StartEnde', 'Szenen')
      const larrQuellen = this.$E.Daten_laden('StartEnde', 'Quellen')
      if (this.$store.state.StartEnde.Hinweis_Ende) {
        this.$OBS.Text(
          larrQuellen.Ende_Weitere_Hinweise,
          this.$store.state.StartEnde.Hinweis_Ende_Text, 70, 'Arial'
        )
        this.$OBS.Sichtbarkeit(larrSzenen.Ende, larrQuellen.Ende_Weitere_Hinweise, true)
      } else {
        this.$OBS.Sichtbarkeit(larrSzenen.Ende, larrQuellen.Ende_Weitere_Hinweise, false)
      }
      if (Modus === 'Vorschau') {
        this.$OBS.Szene('Vorschau', larrSzenen.Ende)
      }
      if (Modus === 'Live') {
        this.$OBS.Szene('Vorschau', larrSzenen.Ende)
        this.$OBS.Szene('Live', larrSzenen.Ende, 3000)
        if (this.$store.state.StartEnde.AutomatischBeenden) {
          const lintMillisekunden = this.$store.state.StartEnde.AutomatischBeendenMinuten * 60 * 1000
          setTimeout(() => {
            this.automatisch_Beenden(this.$store.state.StartEnde.AutomatischYouTubeUnsichtbar)
          }, lintMillisekunden)
        }
      }
    },
    automatisch_Beenden (YouTube) {
      this.$store.commit('app/setze', { Übertragung_läuft: false })
      this.$OBS.Stream('beenden')
      this.$q.notify('Stream beendet')
      if (YouTube) {
        this.$YT.Schalter(this.$store.state.app.YouTubeID, 'private')
        this.$q.notify('YouTube auf privat gesetzt')
      }
    }
  }
}
</script>
