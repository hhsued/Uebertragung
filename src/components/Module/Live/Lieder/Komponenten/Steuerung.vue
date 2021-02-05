
<template lang="pug">
div
  .row
    .col
      q-card(style="min-width: 300px")
        Werkzeugleiste(Titel="Lieder")
        q-separator
        Ausgabe(
          v-if="$store.state.Lieder.Nummer !== '' && $store.state.Lieder.Art !== ''",
          GlobalerSpeicher="Lieder",
          Perspektivenname="Lied_Anzeige",
          @Perspektive="Standardperspektive = $event",
          @Aktion="on_Aktion"
        )
        q-separator
        Daten(
          @eingegeben="on_Strophen_anzeigen",
          @strophen_unsichtbar="Strophen_anzeigen = false"
        )
  .row(v-if="Strophen_anzeigen")
    .col
      Strophen(
        :Nummer="Nummer",
        @verstecken="Strophen_anzeigen = false",
        :Strophen="Strophen"
      )
</template>

<script>
const gmodPfad = require('path')
const gmodDS = require('fs')

import Strophen from './Strophen/Index'
import Daten from './Daten/Daten'

import Ausgabe from './../../../../Einzelkomponenten/Ausgabe'
import Werkzeugleiste from './../../../../Einzelkomponenten/Werkzeugleiste'

const lstrDatenpfad = gmodPfad.join(
  process.cwd(),
  'Daten', 'Liedtexte'
)

export default {
  name: 'Lieder',
  components: { Strophen, Ausgabe, Werkzeugleiste, Daten },
  data: () => ({
    Strophen_anzeigen: false,
    Standardperspektive: true,
    Nummer: '',
    Strophen: null
  }),
  mounted () {
  },
  methods: {
    on_Strophen_anzeigen () {
      if (this.$store.state.Lieder.Erfassungsmodus === 'Selektion') {
        this.Nummer = this.$store.state.Lieder.Nummer
        this.Strophen_anzeigen = true
      } else {
        this.Strophen_anzeigen = false
      }
    },
    on_Modus (Modus) {
      if (Modus === 'Eingabe') {
        this.Strophen_anzeigen = false
      }
    },
    on_Aktion (Aktion) {
      const lstrSzene = this.$E.Daten_laden('Lieder', 'Szenen', 'Lied')
      const larrQuellen = this.$E.Daten_laden('Lieder', 'Quellen')

      const lobjAnsichtskonfiguration = [
        {
          Typ: 'Text',
          Quelle: larrQuellen.Nummer,
          Text: this.Liednummer(),
          Schriftgröße: 75,
          Schriftart: 'Arial',
          Kontur: true,
          Konturfarbe: '4278190080',
          Konturgröße: 5
        },
        {
          Typ: 'Text',
          Quelle: larrQuellen.Titel,
          Text: this.Liedtitel(),
          Schriftgröße: 60,
          Schriftart: 'Arial',
          Kontur: true,
          Konturfarbe: '4278190080',
          Konturgröße: 5
        }
      ]

      this.$Helfer.Aktionen(
        Aktion,
        ((this.$store.state.Lieder.Art === 'Abendmahlslied') ? 'S_Strophe' : lstrSzene),
        'Lieder',
        this.Standardperspektive,
        this.$store,
        lobjAnsichtskonfiguration,
        ((this.$store.state.Lieder.Art === 'Abendmahlslied') ? 'Lied_Abendmahl' : 'Lied_Normal'))
    },

    Liedtitel () {
      let lstrLiedTitel = ''
      if (this.$store.state.Lieder.Erfassungsmodus === 'Eingabe') {
        if (this.$store.state.Lieder.Titel !== '') {
          lstrLiedTitel = this.$store.state.Lieder.Titel
        } else {
          lstrLiedTitel = ''
        }
      } else {
        const lstrLied = gmodPfad.join(lstrDatenpfad, 'Gesangbuch', this.$store.state.Lieder.Nummer + '.json')
        lstrLiedTitel = JSON.parse(gmodDS.readFileSync(lstrLied, 'utf-8')).Titel
      }
      return lstrLiedTitel
    },
    Liednummer () {
      let lstrLied = ''
      if (this.$store.state.Lieder.Erfassungsmodus === 'Selektion') {
        lstrLied = 'Nr. ' + this.$store.state.Lieder.Nummer
        if (this.$store.state.Lieder.Art === '') {
          lstrLied = 'EingangsLied ' + lstrLied
        } else {
          lstrLied = this.$store.state.Lieder.Art + ' ' + lstrLied
        }
      } else {
        if (this.$store.state.Lieder.Art !== 'ohne') {
          lstrLied = this.$store.state.Lieder.Art + ' Nr. '
        }
        lstrLied += this.$store.state.Lieder.Nummer
      }
      return lstrLied
    }
  }
}
</script>
