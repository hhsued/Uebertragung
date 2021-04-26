
<template lang="pug">
div
  .row
    .col
      q-card
        q-card-section(style="padding-top: 5px; padding-bottom: 5px")
          Werkzeugleiste(Titel="Textwort")
        q-separator
        q-card-section
          Ausgabe(
            v-if="$store.state.Textwort.Buch !== null && $store.state.Textwort.Kapitel !== null && $store.state.Textwort.Vers_von !== null",
            GlobalerSpeicher="Textwort",
            @Perspektive="Standardperspektive = $event",
            @Aktion="on_Aktion"
          )
        q-card-section
          Daten(@Aktion="on_Verse", @Eingabe="bearbeiten_anzeigen = false")
    .col(v-if="bearbeiten_anzeigen")
      bearbeiten(:Verse="Verse", @bearbeiten="$emit('bearbeiten', $event)")
</template>

<script>

import Daten from './Daten/Daten'
import Ausgabe from './../../../../Einzelkomponenten/Ausgabe'
import Werkzeugleiste from './../../../../Einzelkomponenten/Werkzeugleiste'
import bearbeiten from './Daten/bearbeiten'

export default {
  name: 'Allgemein_Steuerung',
  props: [],
  components: { Daten, Ausgabe, Werkzeugleiste, bearbeiten },
  data: () => ({
    bearbeiten_anzeigen: false,
    Verse: [],
    Standardperspektive: true
  }),
  watch: {
  },
  mounted () {
  },
  methods: {
    on_Verse (Daten) {
      if (Daten.Aktion !== 'neu') {
        this.Verse = Daten.Verse
        this.bearbeiten_anzeigen = true
      } else {
        this.bearbeiten_anzeigen = false
      }
    },

    Ort_erstellen () {
      return this.$store.state.Textwort.Buch + ' ' +
        this.$store.state.Textwort.dasKapitel + ', ' +
        this.$store.state.Textwort.Vers_von +
        (this.$store.state.Textwort.Vers_bis !== null && this.$store.state.Textwort.Vers_bis !== '' ? ' - ' + this.$store.state.Textwort.Vers_bis : '')
    },
    on_Aktion (Aktion) {
      const lstrSzene = this.$E.Daten_laden('Textwort', 'Szenen', 'Textwort')
      const larrQuellen = this.$E.Daten_laden('Textwort', 'Quellen')
      const lobjTextwort = this.Text_Textwort_bearbeiten()

      const lobjAnsichtskonfiguration = [
        {
          Typ: 'Text',
          Quelle: larrQuellen.Ort,
          Text: this.Ort_erstellen(),
          Schriftgröße: 80,
          Schriftart: 'Arial',
          Kontur: true,
          Konturfarbe: '4278190080',
          Konturgröße: 5
        }]
      if (!this.$store.state.Textwort.OhneText) {
        lobjAnsichtskonfiguration.push(
          {
            Typ: 'Text_Hintergrund',
            Textquelle: larrQuellen.Verse,
            Szene: lstrSzene,
            Text: lobjTextwort.Text,
            Schriftart: 'Arial',
            Schriftgröße: 60,
            Unten: 10,
            Oben: 10,
            Links: 40,
            Hintergrundquelle: larrQuellen.Hintergrund_Verse
          })
      }

      this.$Helfer.Aktionen(
        Aktion,
        lstrSzene,
        'Textwort',
        this.Standardperspektive,
        this.$store,
        lobjAnsichtskonfiguration,
        (this.$store.state.Textwort.OhneText) ? 'Ohne_Text' : 'Standard')
    },
    säubere_Text (Text) {
      let lstrText = Text.replace(/&nbsp;/g, '')
      lstrText = lstrText.replace(/<div>/g, '\n')
      lstrText = lstrText.replace(/<\/div>/g, '')
      lstrText = lstrText.replace(/<span style="color: inherit;">/g, '')
      lstrText = lstrText.replace(/<\/span>/g, '')
      return lstrText
    },
    Text_Textwort_bearbeiten () {
      if (this.$store.state.Textwort.Erfassungsmodus === 'Selektion') {
        let lstrText = ''
        let lintZeilenzaehler = 0
        this.Verse.forEach(lobjTextwort => {
          lstrText += lobjTextwort.Vers.toString() + '. '
          const larrTextwort = lobjTextwort.Text.split('<br />')
          larrTextwort.forEach(lstrTextwort => {
            lintZeilenzaehler++
            lstrText += lstrTextwort + '\n'
          })
        })
        return { Text: lstrText, Zeilen: lintZeilenzaehler }
      } else {
        // eslint-disable-next-line no-unused-vars
        const lstrText = this.säubere_Text(this.$store.state.Textwort.Text)
        return { Text: lstrText }
      }
    }
  }
}
</script>
