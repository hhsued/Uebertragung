 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card
      q-card-section
        q-toolbar
          q-toolbar-title Mikrofone
          q-btn(icon="add", flat, dense, @click="on_neu")
          q-btn(icon="save", flat, dense, @click="on_speichern")
      q-card-section
        q-list
          q-item(v-for="(Kamera, KIndex) in Mikrofone", :key="KIndex")
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

import Quellen from './../../../Einzelkomponenten/Quellen'
import Szenen from './../../../Einzelkomponenten/Szenen'
export default {
  Name: 'Einstellungen_Mikrofone',
  components: { Quellen, Szenen },
  data: () => ({
    Registerkarten: 'Mikrofone',
    Mikrofone: {}
  }),
  mounted () {
    this.Mikrofone = this.$E.Daten_laden('Basis', 'Mikrofone')
  },
  methods: {
    on_neu () {
      this.Mikrofone.push({ Name: '', Hilfstext: '', Quelle: '' })
    },
    on_speichern () {
      this.$E.Daten_speichern('Basis', 'Mikrofone', this.Mikrofone)
    },
    on_Kamera_loeschen (Index) {
      this.$q.dialog({
        title: 'Kamera löschen',
        message: 'Möchtest Du diese Kamera wirklich löschen: ' + this.Mikrofone[Index].Name,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.Mikrofone.splice(Index, 1)
      })
    }
  }
}
</script>
