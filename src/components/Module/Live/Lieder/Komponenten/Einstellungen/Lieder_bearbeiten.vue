 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card
      q-card-section
        q-input(
          label="Eingrenzen",
          v-if="Lieder.length > 0",
          v-model="Grenze",
          @input="on_eingrenzen"
        )
          template(v-slot:after)
            q-btn(
              round,
              dense,
              flat,
              icon="close",
              @click="Grenze = 0; on_eingrenzen()"
            )
      q-separator
      q-card-section(v-if="Lieder.length > 0")
        .row
          .col
            q-card(v-if="Lieder.length > 0")
              q-card-section
                q-list(v-if="Lieder.length > 0", bordered, separator)
                  q-item(
                    v-for="(Lied, Index) in Lieder",
                    :key="Index",
                    clickable,
                    v-ripple,
                    @click="on_Lied(Lied)"
                  )
                    q-item-section
                      | {{ Lied }}
          .col(v-if="Lied !== ''")
            q-card
              q-card-section
                q-toolbar
                  q-space
                  q-btn(icon="save", unelevated, @click="on_speichern")
              q-card-section
                .text-h6 {{ Titel }}
              q-card-section
                q-list(bordered, separator)
                  q-item(v-for="(Strophe, SIndex) in Strophen", :key="SIndex")
                    q-item-section
                      b Strophe {{ SIndex + 1 }}
                      Editor(v-model="Strophen[SIndex]")
</template>
<script>
const gmodDS = require('fs')
const gmodPfad = require('path')

const lstrDatenpfad = gmodPfad.join(
  process.cwd(),
  'Daten', 'Liedtexte'
)

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
    Titel: '',
    Strophen: [],
    Liedersammlung: 'Gesangbuch',
    Zeituhr: null
  }),
  mounted () {
    this.on_Liedersammlung()
  },
  methods: {
    säubere_Text () {
      for (let lintZaehler = 0; lintZaehler < this.Strophen.length; lintZaehler++) {
        this.Strophen[lintZaehler] = this.Strophen[lintZaehler].replace(/&nbsp;/g, '')
        this.Strophen[lintZaehler] = this.Strophen[lintZaehler].replace(/<div>/g, '<br />')
        this.Strophen[lintZaehler] = this.Strophen[lintZaehler].replace(/<\/div>/g, '')
        this.Strophen[lintZaehler] = this.Strophen[lintZaehler].replace(/<span style="color: inherit;">/g, '')
        this.Strophen[lintZaehler] = this.Strophen[lintZaehler].replace(/<\/span>/g, '')
      }
    },
    on_speichern () {
      this.säubere_Text()
      gmodDS.writeFileSync(gmodPfad.join(lstrDatenpfad, this.Liedersammlung, this.Lied + '.json'), JSON.stringify({ Titel: this.Titel, Strophen: this.Strophen }), 'utf-8')
      this.$q.notify('Daten gespeichert')
    },
    on_Lied (Lied) {
      this.Lied = Lied
      let lobjDaten
      try {
        lobjDaten = JSON.parse(gmodDS.readFileSync(gmodPfad.join(lstrDatenpfad, this.Liedersammlung, this.Lied + '.json'), 'utf-8'))
      } catch (Fehler) {
        lobjDaten = JSON.parse(gmodDS.readFileSync(gmodPfad.join(lstrDatenpfad, this.Liedersammlung, this.Lied + 'a.json'), 'utf-8'))
      }
      this.Titel = lobjDaten.Titel
      this.Strophen = lobjDaten.Strophen
    },
    on_Liedersammlung (Grenzwert = null) {
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
