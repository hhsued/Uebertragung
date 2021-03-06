 <template lang="pug">
    q-card
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
                      q-checkbox(:label="'Strophe: ' + (SIndex + 1)", v-model="Selektionsstrophen", :val="(SIndex + 1)", @input="on_Auswahl")
                      div(v-html="Strophen.Strophen[SIndex]")
</template>
<script>
const gmodDS = require('fs')
const gmodPfad = require('path')

const lstrDatenpfad = gmodPfad.join(
  process.cwd(),
  'Daten', 'Liedtexte'
)
export default {
  name: 'einstellungenBasis',
  components: {},
  props: {
  },
  data: () => ({
    Grenze: 0,
    Registerkarten: 'Quellen',
    Liedersammlungen: [],
    Lieder: [],
    Lied: '',
    Selektionsstrophen: [],
    Strophen: {},
    Liedersammlung: '',
    Zeituhr: null
  }),
  mounted () {
    this.Liedersammlungen = gmodDS.readdirSync(lstrDatenpfad)
  },
  methods: {
    on_Auswahl () {
      this.$emit('Eingabe', { Lied: this.Lied, Strophen: this.Selektionsstrophen })
    },
    on_Lied (Lied) {
      this.Lied = Lied
      this.Strophen = {}
      try {
        this.Strophen = JSON.parse(gmodDS.readFileSync(gmodPfad.join(lstrDatenpfad, this.Liedersammlung, this.Lied + '.json'), 'utf-8'))
      } catch (Fehler) {
        this.Strophen = JSON.parse(gmodDS.readFileSync(gmodPfad.join(lstrDatenpfad, this.Liedersammlung, this.Lied + 'a.json'), 'utf-8'))
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
