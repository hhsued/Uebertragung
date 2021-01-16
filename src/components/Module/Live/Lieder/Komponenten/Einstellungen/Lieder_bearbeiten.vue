 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card
      q-card-section
        q-toolbar
          q-toolbar-title Alle Lieder
      q-card-section
        q-select(
          label="Liedersammlung",
          :options="Liedersammlungen",
          v-model="Liedersammlung",
          @input="on_Liedersammlung")
      q-separator
      q-card-section
        q-input(label="Eingrenzen", v-if="Lieder.length > 0", v-model="Grenze", @input="on_eingrenzen")
          template(v-slot:after)
            q-btn(round dense flat icon="close", @click="Grenze = 0; on_eingrenzen()")
      q-separator
      q-card-section(v-if="Lieder.length > 0")
        .row
          .col
            q-card(v-if="Lieder.length > 0")
              q-card-section
                q-list(v-if="Lieder.length > 0", bordered, separator)
                  q-item(v-for="(Lied, Index) in Lieder" :key="Index", clickable, v-ripple, @click="on_Lied(Lied)")
                    q-item-section
                      | {{Lied}}
          .col(v-if="Lied !== ''")
            q-card()
              q-card-section
                .text-h6 {{ Strophen.Titel }}
              q-card-section
                q-list(bordered, separator)
                  q-item(v-for="(Strophe, SIndex) in Strophen.Strophen",
                    :key="SIndex")
                    q-item-section
                      b Strophe {{SIndex + 1}}
                      Editor(v-model="Strophen.Strophen[SIndex]")
</template>
<script>
const gmodDS = require('fs')
const gmodPfad = require('path')

const lstrDatenpfad = gmodPfad.join(
  process.cwd(),
  'Daten', 'Liedtexte'
)
const lstrVorgabenpfad = gmodPfad.join(process.cwd(), 'Daten', 'Einstellungen', 'Vorgaben', 'Lieder')

import Quellen from './../../../../../Einzelkomponenten/Quellen'
import Szenen from './../../../../../Einzelkomponenten/Szenen'
import Editor from './../../../../../Einzelkomponenten/Editor'
export default {
  name: 'einstellungenBasis',
  components: { Quellen, Szenen, Editor },
  props: {
  },
  data: () => ({
    Grenze: 0,
    Registerkarten: 'Quellen',
    Liedersammlungen: [],
    Lieder: [],
    Lied: '',
    Strophen: {},
    Liedersammlung: '',
    Zeituhr: null
  }),
  mounted () {
    this.Liedersammlungen = gmodDS.readdirSync(lstrDatenpfad)
    this.Vorgabe.Uhrzeit = '10:00'
    this.Vorgabe.Datum = this.naechster_Gottesdienst()
  },
  methods: {
    naechster_Gottesdienst () {
      // eslint-disable-next-line prefer-const
      let ldtDatum = new Date()

      switch (ldtDatum.getDay()) {
        case 0:
        case 3:
          // Sonntag/Mittwoch - Nimm heute
          break
        case 1:
          // Montag - Nimm Mittwoch
          ldtDatum.setDate(ldtDatum.getDate() + 2)
          break
        case 2:
          // Dienstag - Nimm Mittwoch
          ldtDatum.setDate(ldtDatum.getDate() + 1)
          break
        case 4:
          // Donnerstag - Nimm Sonntag
          ldtDatum.setDate(ldtDatum.getDate() + 3)
          break
        case 5:
          // Freitag - Nimm Sonntag
          ldtDatum.setDate(ldtDatum.getDate() + 2)
          break
        case 6:
          // Samstag - Nimm Sonntag
          ldtDatum.setDate(ldtDatum.getDate() + 1)
          break
      }
      return ldtDatum.getFullYear() + '-' + ldtDatum.getMonth() + '-' + ldtDatum.getDate()
    },
    on_Vorgabe_sichern () {
      const lobjVorgabe = { Art: this.Vorgabe.Art, Lied: this.Vorgabe.Lied, Strophen: this.Vorgabe.Strophen, Uhrzeit: this.Vorgabe.Uhrzeit, Datum: this.Vorgabe.Datum }
      this.$store.commit('Lieder/VorgabeHinzufügen', lobjVorgabe)
      const lstrPfadDatei = gmodPfad.join(
        lstrVorgabenpfad,
        this.Vorgabe.Datum.split('-')[0] +
        (parseInt(this.Vorgabe.Datum.split('-')[1]) + 1) +
        this.Vorgabe.Datum.split('-')[2] + '_' +
        this.Vorgabe.Uhrzeit.replace(':', '') +
        '.json')
      if (!gmodDS.existsSync(lstrPfadDatei)) {
        gmodDS.writeFileSync(lstrPfadDatei, JSON.stringify([]), 'utf-8')
      }
      const lobjDaten = JSON.parse(gmodDS.readFileSync(lstrPfadDatei, 'utf-8'))
      lobjDaten.push(lobjVorgabe)
      gmodDS.writeFileSync(lstrPfadDatei, JSON.stringify(lobjDaten), 'utf-8')
      this.$q.notify('Daten in Vorgaben gespeichert')
      this.Vorgabe.Lied = 0
      this.Vorgabe.Art = ''
      this.Vorgabe.Strophen = []
    },
    on_Lied (Lied) {
      this.Lied = Lied
      this.Strophen = {}
      this.Strophen = JSON.parse(gmodDS.readFileSync(gmodPfad.join(lstrDatenpfad, this.Liedersammlung, this.Lied + '.json'), 'utf-8'))
    },
    on_Vorgabe (Strophenindex) {
      if (this.Vorgabe.Lied === 0) {
        this.Vorgabe.Lied = this.Lied
      }
      if (!this.Vorgabe.Strophen.includes(Strophenindex + 1)) {
        this.Vorgabe.Strophen.push(Strophenindex + 1)
      }
    },
    on_Liedersammlung (Grenzwert = null) {
      if (typeof (Grenzwert) === 'string') {
        Grenzwert = null
      }
      if (Grenzwert === 0) {
        Grenzwert = null
      }
      this.Lieder = []
      gmodDS.readdirSync(gmodPfad.join(lstrDatenpfad, this.Liedersammlung)).forEach(lstrLied => {
        if (Grenzwert === null) {
          this.Lieder.push(lstrLied.replace('.json', ''))
        } else {
          if (lstrLied.indexOf(Grenzwert) > -1) {
            this.Lieder.push(lstrLied.replace('.json', ''))
          }
        }
      })
    },
    on_eingrenzen () {
      clearTimeout(this.Zeituhr)
      this.Zeituhr = setTimeout(() => {
        this.on_Liedersammlung(parseInt(this.Grenze))
      }, 2000)
    }
  }
}
</script>
