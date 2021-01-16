 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-dialog(
      v-model="Dialog"

      full-width
      transition-show="slide-up"
      transition-hide="slide-down")
      q-card
        q-card-section
          q-toolbar
            q-toolbar-title
            q-btn(icon="close", unelevated, v-close-popup)
            q-btn(icon="done", unelevated, @click="on_Daten_speichern", v-if="Liederart !== null && Object.keys(Strophen).length > 0")
        q-card-section(v-if="Modus === 'Neues Lied hinzufügen'")
          q-select(label="Liederart", :options="Liederarten", v-model="Liederart")
          LiedSelektion(@Eingabe="Strophen = $event")
    q-toolbar
      q-toolbar-title
        | Vorgaben
      q-space
      q-btn(icon="add", unelevated, @click="on_neue_Vorgabe")
    div(v-if="Object.keys(Dateien).length > 0")
      q-list(separator)
        q-expansion-item(
          v-for="(Datei, Index) in Object.keys(Dateien)" :key="Index"
          expand-separator
          switch-toggle-side
          expand-icon-toggle
          popup)
          template(v-slot:header)
            q-item-section
              .text-h6 {{Datei.split(' - ')[0]}}
              b {{Datei.split(' - ')[1]}}
            q-item-section(side)
              div(class="row items-center")
                q-btn(icon="add", unelevated, @click="on_neues_Lied(Datei)")
                q-btn(icon="delete", unelevated)
                q-btn(icon="save", unelevated, @click="on_speichern(Datei)")
          q-card
            q-card-section
              q-list
                q-item(v-for="(Lied, LIndex) in Dateien[Datei]" :key="LIndex")
                  q-item-section(avatar)
                    q-btn(icon="delete", unelevated)
                  q-item-section(avatar)
                    q-btn(icon="edit", unelevated)
                  q-item-section
                    .text-h6 {{Lied.Art}}
                    b Lied-Nr.: {{Lied.Lied}}
                    | Strophen: {{Lied.Strophen}}
</template>
<script>
const gmodDS = require('fs')
const gmodPfad = require('path')
const lstrVorgabenpfad = gmodPfad.join(process.cwd(), 'Daten', 'Einstellungen', 'Vorgaben', 'Lieder')

import LiedSelektion from './../../../../../Einzelkomponenten/LiedSelektion'

export default {
  name: 'einstellungenBasis',
  components: { LiedSelektion },
  props: {
  },
  data: () => ({
    Dateien: {},
    Dialog: false,
    Modus: '',
    Liederart: null,
    Liednummer: null,
    Liederarten: [],
    Liederarten_sicher: [],
    Strophen: {},
    aktive_Datei: ''
  }),
  mounted () {
    this.Liederarten_sicher = this.$E.Daten_laden('Lieder', 'Optionen', 'Liederarten')
    gmodDS.readdirSync(lstrVorgabenpfad).forEach(lstrDatei => {
      const ldtDateiDatum = new Date(
        parseInt(lstrDatei.substring(0, 4)),
        parseInt(lstrDatei.substring(4, 6) - 1),
        parseInt(lstrDatei.substring(6, 8)),
        parseInt(lstrDatei.substring(9, 11)),
        parseInt(lstrDatei.substring(11, 13)),
        0, 0)
      if (new Date() < ldtDateiDatum) {
        const lstrDatumZeit = this.$Helfer.Stellen(ldtDateiDatum.getDate(), 2) + '.' + this.$Helfer.Stellen(ldtDateiDatum.getMonth() + 1, 2) + '.' + this.$Helfer.Stellen(ldtDateiDatum.getFullYear(), 4) + ' - ' + this.$Helfer.Stellen(ldtDateiDatum.getHours(), 2) + ':' + this.$Helfer.Stellen(ldtDateiDatum.getMinutes(), 2)
        this.$set(this.Dateien, lstrDatumZeit, JSON.parse(gmodDS.readFileSync(gmodPfad.join(lstrVorgabenpfad, lstrDatei), 'utf8')))
      }
    })
  },
  methods: {
    on_speichern (Datei) {
      let larrDatum = Datei.split(' - ')[0]
      let larrUhrzeit = Datei.split(' - ')[1]
      larrDatum = larrDatum.split('.')
      larrUhrzeit = larrUhrzeit.split(':')
      const lstrDatei = larrDatum[2] + larrDatum[1] + larrDatum[0] + '_' + larrUhrzeit[0] + larrUhrzeit[1] + '.json'
      gmodDS.writeFileSync(gmodPfad.join(lstrVorgabenpfad, lstrDatei), JSON.stringify(this.Dateien[Datei]), 'utf-8')
    },
    on_Daten_speichern () {
      if (this.Modus === 'Neues Lied hinzufügen') {
        this.Dateien[this.aktive_Datei].push({ Art: this.Liederart, Lied: this.Strophen.Lied, Strophen: this.Strophen.Strophen })
        this.Dialog = false
      }
    },
    on_neue_Vorgabe () {},
    on_neues_Lied (Datei) {
      this.Liederarten = this.Liederarten_sicher
      this.Dateien[Datei].forEach(lobjInhalt => {
        if (this.Liederarten.indexOf(lobjInhalt.Art) > -1) {
          this.Liederarten.splice(this.Liederarten.indexOf(lobjInhalt.Art), 1)
        }
      })
      this.Modus = 'Neues Lied hinzufügen'
      this.aktive_Datei = Datei
      this.Dialog = true
    }
  }
}
</script>
