 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card(style="min-width: 400px")
      q-card-section
        q-toolbar
          q-toolbar-title Einstellungen für Start / Ende
          q-btn(icon="save", round, flat, dense, @click="on_speichern")
      q-card-section
        q-tab-panels(v-model="Registerkarten", animated)
          q-tab-panel(name="Quellen")
            q-toolbar
              q-toolbar-title Quellen
            Quellen(
              v-for="(Element, EIndex) in Object.keys(Quellen)",
              :beschriftung="Element",
              v-model="Quellen[Element]",
              :key="EIndex"
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
          q-tab-panel(name="Standardwerte")
            q-toolbar
              q-toolbar-title Standardwerte
            div
              q-select(
                label="Gottesdienstart",
                v-model="Konfig.Standardwerte.Gottesdienstart",
                :options="Konfig.Optionen.Gottesdienstarten"
              )
            div
              q-checkbox(v-model="Konfig.Standardwerte.Uhrzeit") Uhrzeit
            div
              q-checkbox(v-model="Konfig.Standardwerte.Datum") Datum
            div
              q-checkbox(v-model="Konfig.Standardwerte.Hinweis") Hinweis
            div
              q-input(label="Hinweistext", v-if="Konfig.Standardwerte.Hinweis")
            div
              q-checkbox(v-model="Konfig.Standardwerte.Startzeit") Startuhrzeit
            div
              q-checkbox(v-model="Konfig.Standardwerte.Endetext") Text am Ende
          q-tab-panel(name="Optionen")
            q-toolbar
              q-toolbar-title Optionen
            q-select(
              label="Typen",
              v-model="Konfig.Optionen.Gottesdienstarten",
              use-input,
              use-chips,
              multiple,
              hide-dropdown-icon,
              input-debounce="0",
              new-value-mode="add-unique"
            )
        q-tabs.text-grey.bg-grey-3(
          v-model="Registerkarten",
          dense,
          align="justify",
          narrow-indicator
        )
          q-tab(name="Quellen", label="Quellen")
          q-tab(name="Szenen", label="Szenen")
          q-tab(name="Standardwerte", label="Standardwerte")
          q-tab(name="Optionen", label="Optionen")
</template>
<script>

import Quellen from './../../../../Einzelkomponenten/Quellen'
import Szenen from './../../../../Einzelkomponenten/Szenen'

export default {
  name: 'Einstellungen_Start_Ende',
  components: { Quellen, Szenen },
  props: {},
  data: () => ({
    Registerkarten: 'Quellen',
    Konfig: {},
    Quellen: {},
    Szenen: {}
  }),
  mounted () {
    this.Konfig = this.$E.Daten_laden('StartEnde', 'Start_Ende')
    this.Szenen = this.$E.Daten_laden('StartEnde', 'Szenen')
    this.Quellen = this.$E.Daten_laden('StartEnde', 'Quellen')
  },
  methods: {
    on_speichern () {
      this.$E.speichern('Start_Ende', this.Konfig)
      this.$q.notify('Erfolgreich gespeichert')
    }

  }
}
</script>
