 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card(style="min-width: 400px")
      q-card-section
        q-toolbar
          q-toolbar-title Textwort
          q-btn(icon="save", dense, flat, @click="onSpeichern")
      q-tab-panels(v-model="Registerkarten", animated)
        q-tab-panel(name="Quellen")
          q-toolbar
            q-toolbar-title Quellen
          Quellen(
            v-for="(Quelle, QIndex) in Object.keys(Quellen)",
            :beschriftung="Quelle",
            v-model="Quellen[Quelle]",
            :key="QIndex"
          )
        q-tab-panel(name="Szenen")
          q-toolbar
            q-toolbar-title Szenen

          Szenen(
            v-for="(Szene, SIndex) in Object.keys(Szenen)",
            :beschriftung="Szene",
            v-model="Szenen[Szene]",
            :key="SIndex"
          )
      q-tabs.text-grey.bg-grey-3(
        v-model="Registerkarten",
        dense,
        align="justify",
        narrow-indicator
      )
        q-tab(name="Quellen", label="Quellen")
        q-tab(name="Szenen", label="Szenen")
      q-separator
</template>
<script>

import Quellen from './../../../../../Einzelkomponenten/Quellen'
import Szenen from './../../../../../Einzelkomponenten/Szenen'
export default {
  name: 'Einstellungen_Textwort',
  components: { Quellen, Szenen },
  props: {
    Dialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    Registerkarten: 'Quellen',
    Quellen: null,
    Szenen: null
  }),
  mounted () {
    this.Quellen = this.$E.Daten_laden('Allgemein', 'Quellen')
    this.Szenen = this.$E.Daten_laden('Allgemein', 'Szenen')
  },
  methods: {

    onSpeichern () {
      this.$E.Daten_speichern('Allgemein', 'Quellen', this.Quellen)
      this.$E.Daten_speichern('Allgemein', 'Szenen', this.Szenen)
    },
    on_Kapitel () {
      this.$Bibel.lade_Kapitel(this.Daten.Buch, this.Daten.Kapitel)
      this.Verse = this.$Bibel.Kapitel()
    },
    on_Buch () {
      this.Optionen.Kapitel = []
      for (let lintZaehler = 1; lintZaehler <= this.$Bibel.anzahl_Kapitel_zu_Buch(this.Daten.Buch); lintZaehler++) {
        this.Optionen.Kapitel.push(lintZaehler)
      }
    }

  }
}
</script>
