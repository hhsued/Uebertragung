
<template lang="pug">
q-card-section
  | Strophen
  div(class="q-pa-md row items-start q-gutter-md")
    q-card(v-for="(Strophe, Index) in $store.state.Lieder.Strophen",
      :key="Index")
      q-card-section
        q-btn(icon="play_arrow", unelevated, @click="on_Aktion('Live', Index)")
        q-btn(icon="visibility", unelevated, @click="on_Aktion('Vorschau', Index)")
      q-card-section
        .text-h6 Strophe {{ Index + 1 }}
        div(v-html="Strophe.Text")
        div(v-if="Strophe.Text.indexOf('<br />') === -1")
          b ACHTUNG: Die Strophe ist noch nicht für die Ausgabe optimiert worden
  //-q-list( bordered separator)
    q-item(
      v-for="(Strophe, Index) in $store.state.Lieder.Strophen",
      :key="Index")
      q-item-section(avatar)
        q-btn(icon="play_arrow", unelevated, @click="on_Aktion('Live', Index)")
        q-btn(icon="visibility", unelevated, @click="on_Aktion('Vorschau', Index)")
      q-item-section
        .text-h6 Strophe {{ Index + 1 }}
        div(v-html="Strophe.Text")
        div(v-if="Strophe.Text.indexOf('<br />') === -1")
          b ACHTUNG: Die Strophe ist noch nicht für die Ausgabe optimiert worden
</template>

<script>
/* eslint-disable camelcase */

const gmodPfad = require('path')
const gmodDS = require('fs')

import Werkzeugleiste from './../../../../../Einzelkomponenten/Werkzeugleiste'
import Perspektive from './../../../../../Einzelkomponenten/Perspektive'
import Steuerung from './../../../../../Einzelkomponenten/Steuerung'
import Editor from './../../../../../Einzelkomponenten/Editor'
const lstrDatenpfad = gmodPfad.join(
  process.cwd(),
  'Daten', 'Liedtexte'
)

export default {
  name: 'live_Strophen',
  props: ['Nummer', 'Standardperspektive'],
  components: { Werkzeugleiste, Perspektive, Steuerung, Editor },
  data: () => ({
    Text: '',
    Standardperspektive: true
  }),
  mounted () {
  },
  watch: {
  },
  methods: {
    verarbeite_Strophe (Text, Strophennummer) {
      if (Text.substring(Text.length - 6) === '<br />') {
        Text = Text.substring(Text.length - 6)
      }
      const larrStrophe = Text.split('<br />') // 6
      let lstrText = 'Lied Nr. ' + this.$store.state.Lieder.Nummer + ' - Strophe ' + Strophennummer.toString() + '\n\n'
      larrStrophe.forEach((lstrZeile, lintIndex) => {
        lstrText += lstrZeile
        if (lintIndex < larrStrophe.length - 1) {
          lstrText += '\n'
        }
      })
      return lstrText
    },

    on_Aktion (Aktion, Index) {
      const larrSzenen = this.$E.Daten_laden('Lieder', 'Szenen')
      const larrQuellen = this.$E.Daten_laden('Lieder', 'Quellen')
      const lobjAnsichtskonfiguration = [
        {
          Typ: 'Text_Hintergrund',
          Textquelle: larrQuellen.Strophe,
          Szene: larrSzenen.Strophe,
          Text: this.verarbeite_Strophe(this.$store.state.Lieder.Strophen[Index].Text, Index + 1),
          Schriftart: 'Arial',
          Schriftgröße: 60,
          Unten: 10,
          Oben: 10,
          Links: 40,
          Hintergrundquelle: larrQuellen.Strophe_Hintergrund
        },
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
        larrSzenen.Strophe,
        'Lieder',
        this.Standardperspektive,
        this.$store,
        lobjAnsichtskonfiguration,
        (this.$store.state.Lieder.Art === 'Abendmahlslied') ? 'Strophen_Abendmahl' : 'Strophen_Normal')
    },
    Ansicht_aufbauen (Index) {
      this.$OBS.Text_und_Hintergrund(
        {
          Quelle: this.Konfig.Quellen.Strophe,
          Szene: this.Konfig.Szenen.Strophe,
          Text: this.verarbeite_Strophe(this.Werte.Strophen[Index].Text, Index + 1),
          Schriftart: 'Arial',
          Schriftgröße: 60,
          Unten: 10,
          Oben: 10,
          Links: 40
        },
        {
          Quelle: this.Konfig.Quellen.Strophe_Hintergrund,
          Szene: this.Konfig.Szenen.Strophe
        }
      )
    },
    lade_Daten (Lied) {
      if (Lied !== 0 && Lied !== '0') {
        this.Werte.Strophen = []
        const lstrLiedPfad = gmodPfad.join(lstrDatenpfad, 'Gesangbuch', this.Lied.toString() + '.json')
        const larrStophen = JSON.parse(gmodDS.readFileSync(lstrLiedPfad, 'utf-8'))
        this.Werte.Titel = larrStophen.Titel
        for (let lintZaehler = 0; lintZaehler < larrStophen.Strophen.length; lintZaehler++) {
          const larrDaten = {}
          const lstrText = larrStophen.Strophen[lintZaehler]
          this.$set(larrDaten, 'Text', lstrText)
          this.$set(larrDaten, 'Hintergrundfarbe', 'bg-white')
          this.$set(larrDaten, 'Textfarbe', 'text-black')
          this.$set(larrDaten, 'Bearbeitungsmodus', false)
          this.Werte.Strophen.push(larrDaten)
        }
      }
    },
    Liedtitel () {
      let lstrLiedTitel = ''
      if (this.$store.state.Lieder.Erfassungsmodus === 'manuell') {
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
          lstrLied = this.$store.state.Lieder.Art + ' '
        }
        lstrLied += this.$store.state.Lieder.Nummer
      }
      return lstrLied
    }
  }
}
</script>
