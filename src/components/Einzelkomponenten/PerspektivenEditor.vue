 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card
      q-card-section
        q-toolbar
          q-toolbar-title Perspektiven
          q-btn(icon="add", flat, dense, @click="on_neu")
          q-btn(icon="save", flat, dense, @click="on_speichern")
      q-card-section
        q-list(bordered)
          q-expansion-item(
            v-for="(Perspektive, Index) in Object.keys(Perspektiven)", :key="Index"
            switch-toggle-side
            expand-icon-toggle
            expand-separator)
            template(v-slot:header)
              q-item-section(@click="on_aendern(Index, Perspektive)") {{Perspektive}}
              q-item-section(side)
                q-btn(icon="delete", unelevated, @click="on_loeschen(Perspektive)")
            q-card(style="margin:10px;")
              q-card-section
                Szenen(Beschriftung="Szene", v-model="Perspektiven[Perspektive].Szene")
                .text-h6 Aktive Elemente
                Quellen(Beschriftung="Kamera", v-model="Perspektiven[Perspektive].aktiv.Kamera")
                q-select(
                  v-model="Perspektiven[Perspektive].aktiv.Mikros"
                  multiple
                  :options="Quellen"
                  label="Mikrofone")
                q-select(
                  v-model="Perspektiven[Perspektive].aktiv.Quellen"
                  multiple
                  :options="Quellen"
                  label="Quellen")
              q-card-section
                .text-h6 Inaktive Elemente
                Quellen(Beschriftung="Kamera", v-model="Perspektiven[Perspektive].inaktiv.Kamera")
                q-select(
                  v-model="Perspektiven[Perspektive].inaktiv.Mikros"
                  multiple
                  :options="Quellen"
                  label="Mikrofone")
                q-select(
                  v-model="Perspektiven[Perspektive].inaktiv.Quellen"
                  multiple
                  :options="Quellen"
                  label="Quellen")
          //-q-item(v-for="(Kamera, KIndex) in Perspektiven", :key="KIndex")
            q-item-section(avatar)
              q-btn(
                icon="delete",
                dense,
                flat,
                @click="on_Kamera_loeschen(KIndex)")
            q-item-section
              q-input(label="Name", v-model="Kamera.Name")
              q-input(label="Hilfstext", v-model="Kamera.Hilfstext")
              Quellen(beschriftung="Quelle", v-model="Kamera.Quelle")
</template>
<script>

import Quellen from './Quellen'
import Szenen from './Szenen'
export default {
  Name: 'Einstellungen_Perspektiven',
  components: { Quellen, Szenen },
  props: {
    Komponente: {
      type: String,
      required: true,
      default: 'Basis'
    }
  },
  data: () => ({
    Registerkarten: 'Perspektiven',
    Perspektiven: {},
    Quellen: null
  }),
  async mounted () {
    this.Quellen = await this.$OBS.Quellen_laden()
    this.Perspektiven = this.$E.Daten_laden(this.Komponente, 'Perspektiven')
  },
  methods: {
    on_aendern (Index, Perspektive) {
      this.$q.dialog({
        title: 'Neuer Titel',
        message: 'Bitte den neuen Namen für die Perspektive \'' + Perspektive + '\' eingeben',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(lstrNeuerName => {
        const lobjTemp = {}
        let lobjGesicherteDaten = {}
        Object.keys(this.Perspektiven).forEach(lstrPerspektive => {
          if (lstrPerspektive !== Perspektive) {
            lobjTemp[lstrPerspektive] = this.Perspektiven[lstrPerspektive]
          } else {
            lobjGesicherteDaten = this.Perspektiven[lstrPerspektive]
          }
        })
        lobjTemp[lstrNeuerName] = lobjGesicherteDaten
        this.Perspektiven = lobjTemp
      })
    },
    on_loeschen (Perspektive) {
      this.$q.dialog({
        title: 'Perspektive löschen',
        message: 'Möchtest Du diese Perspektive wirklich löschen: ' + Perspektive,
        cancel: true,
        persistent: true
      }).onOk(() => {
        const lobjTemp = {}
        Object.keys(this.Perspektiven).forEach(lstrPerspektive => {
          if (lstrPerspektive !== Perspektive) {
            lobjTemp[lstrPerspektive] = this.Perspektiven[lstrPerspektive]
          }
        })
        this.Perspektiven = lobjTemp
        this.$q.notify('Daten gelöscht, bitte die Daten noch speichern!')
      })
    },
    on_neu () {
      this.$set(this.Perspektiven, 'ohne_Name', {})
      this.$set(this.Perspektiven.ohne_Name, 'Szene', '')
      this.$set(this.Perspektiven.ohne_Name, 'aktiv', {})
      this.$set(this.Perspektiven.ohne_Name.aktiv, 'Kamera', '')
      this.$set(this.Perspektiven.ohne_Name.aktiv, 'Mikros', [])
      this.$set(this.Perspektiven.ohne_Name.aktiv, 'Quellen', [])
      this.$set(this.Perspektiven.ohne_Name, 'inaktiv', {})
      this.$set(this.Perspektiven.ohne_Name.inaktiv, 'Kamera', '')
      this.$set(this.Perspektiven.ohne_Name.inaktiv, 'Mikros', [])
      this.$set(this.Perspektiven.ohne_Name.inaktiv, 'Quellen', [])
    },
    on_speichern () {
      this.$E.Daten_speichern(this.Komponente, 'Perspektiven', this.Perspektiven)
      this.$q.notify('Daten gespeichert')
    }
  }
}
</script>
