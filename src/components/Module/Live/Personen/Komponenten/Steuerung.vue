
<template lang="pug">
div
  .row
    .col
      q-card(style="min-width: 300px")
        q-card-section
          Werkzeugleiste(Titel="Personen")
        q-separator
        q-card-section
          | {{$store.state.Personen.Person}}
          Ausgabe(
              v-if="$store.state.Personen.Person !== ''",
              GlobalerSpeicher="Personen"
              @Perspektive="Standardperspektive = $event",
              @Aktion="on_Aktion")
        q-separator
        q-card-section
          Daten(@Aktion="on_Aktion($event)")
    .col(v-if="Komponente !== ''")
      component(:is="Komponente", :Person="Person")
</template>

<script>
const gmodFS = require('fs')

import Daten from './Daten/Daten'
import Ausgabe from './../../../../Einzelkomponenten/Ausgabe'
import Werkzeugleiste from './../../../../Einzelkomponenten/Werkzeugleiste'
import neu from './Daten/neu'
import bearbeiten from './Daten/bearbeiten'

export default {
  name: 'Allgemein_Steuerung',
  props: [],
  components: { neu, Daten, Ausgabe, Werkzeugleiste, bearbeiten },
  data: () => ({
    Komponente: '',
    Person: '',
    Standardperspektive: true
  }),
  watch: {
  },
  mounted () {
  },
  methods: {
    on_Aktion (Daten) {
      if (typeof (Daten) === 'string') {
        const lstrDaten = Daten
        Daten = {}
        Daten.Aktion = lstrDaten
      }
      switch (Daten.Aktion) {
        case 'neu':
          this.Komponente = 'neu'
          break
        case 'bearbeiten':
          this.Person = Daten.Person
          this.Komponente = 'bearbeiten'
          break
        case 'Vorschau':
        case 'Live':
          this.Vorschau_Live(Daten.Aktion)
          break
      }
    },
    Vorschau_Live (Aktion) {
      const lstrSzene = this.$E.Daten_laden('Personen', 'Szenen', 'Person')
      const larrQuellen = this.$E.Daten_laden('Personen', 'Quellen')

      const lobjAnsichtskonfiguration = [
        {
          Typ: 'Text',
          Quelle: larrQuellen.Name,
          Text: this.erstelle_Name('Name'),
          Schriftgröße: 75,
          Schriftart: 'Arial',
          Kontur: true,
          Konturfarbe: '4278190080',
          Konturgröße: 5
        },
        {
          Typ: 'Text',
          Quelle: larrQuellen.Zusatz,
          Text: this.erstelle_Name('Zusatz'),
          Schriftgröße: 60,
          Schriftart: 'Arial',
          Kontur: true,
          Konturfarbe: '4278190080',
          Konturgröße: 5
        }]

      this.$Helfer.Aktionen(
        Aktion,
        lstrSzene,
        'Personen',
        this.Standardperspektive,
        this.$store,
        lobjAnsichtskonfiguration)
    },
    on_Filter_gewaehlt () {
      this.filtern(this.$store.state.Personen.Bereich)
    },
    erstelle_Name (Was) {
      if (this.$store.state.Personen.Erfassungsmodus === 'Selektion') {
        let lobjPersonen = null
        let lstrRückgabeWert = ''
        if (Was === 'Zusatz') {
          lobjPersonen = JSON.parse(gmodFS.readFileSync(this.$store.state.Personen.Datenpfad, 'utf-8'))
          const lstrVorname = this.$store.state.Personen.Person.split(',')[1].substring(1)
          const lstrNachname = this.$store.state.Personen.Person.split(',')[0]
          lobjPersonen.forEach(lobjPerson => {
            if (lobjPerson.Vorname === lstrVorname && lobjPerson.Nachname === lstrNachname) {
              lstrRückgabeWert = lobjPerson.Amt + (lobjPerson.Zusatz !== '' ? ' - ' + lobjPerson.Zusatz : '')
            }
          })
        }
        if (Was === 'Name') {
          lstrRückgabeWert = this.$store.state.Personen.Person.split(',')[1].substring(1) + ' ' + this.$store.state.Personen.Person.split(',')[0]
        }
        return lstrRückgabeWert
      } else {
        if (Was === 'Zusatz') {
          return this.$store.state.Personen.Zusatz
        }
        if (Was === 'Name') {
          return this.$store.state.Personen.Person
        }
      }
    }
  }
}
</script>
