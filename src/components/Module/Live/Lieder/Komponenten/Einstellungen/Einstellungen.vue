 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card
      q-card-section
        q-toolbar
          q-toolbar-title Lieder
          q-btn(icon="save", dense, flat, @click="onSpeichern")
          q-btn(
            v-if="dialog",
            icon="close",
            roud,
            flat,
            dense,
            @click="$emit('fertig')"
          )
      q-tab-panels(v-model="Registerkarten", animated)
        q-tab-panel(name="Quellen")
          q-toolbar
            q-toolbar-title Quellen
          Quellen(
            v-for="(Quelle, QIndex) in Object.keys(Quellen)",
            :Beschriftung="Quelle",
            v-model="Quellen[Quelle]"
            :key="QIndex"
          )
        q-tab-panel(name="Szenen")
          q-toolbar
            q-toolbar-title Szenen
          Szenen(
            v-for="(Szene, SIndex) in Object.keys(Szenen)",
            :Beschriftung="Szene",
            v-model="Szenen[Szene]",
            :key="SIndex")
        q-tab-panel(name="Optionen")
          q-toolbar
            q-toolbar-title Optionen
          q-select(
            label="Typen",
            v-model="Optionen.Liederarten",
            use-input,
            use-chips,
            multiple,
            hide-dropdown-icon,
            input-debounce="0",
            new-value-mode="add-unique")
      q-tabs.text-grey.bg-grey-3(
        v-model="Registerkarten",
        dense,
        align="justify",
        narrow-indicator
      )
        q-tab(name="Quellen", label="Quellen")
        q-tab(name="Szenen", label="Szenen")
        q-tab(name="Optionen", label="Optionen")
      q-separator
</template>
<script>

import Quellen from './../../../../../Einzelkomponenten/Quellen'
import Szenen from './../../../../../Einzelkomponenten/Szenen'
export default {
  name: 'einstellungenBasis',
  components: { Quellen, Szenen },
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    Registerkarten: 'Quellen',
    Quellen: null,
    Szenen: null,
    Optionen: null
  }),
  mounted () {
    this.Quellen = this.$E.Daten_laden('Lieder', 'Quellen')
    this.Szenen = this.$E.Daten_laden('Lieder', 'Szenen')
    this.Optionen = this.$E.Daten_laden('Lieder', 'Optionen')
  },
  methods: {
    onSpeichern () {
      this.$E.Daten_speichern('Lieder', 'Quellen', this.Quellen)
      this.$E.Daten_speichern('Lieder', 'Szenen', this.Szenen)
      this.$E.Daten_speichern('Lieder', 'Optionen', this.Optionen)
    }

  }
}
</script>
