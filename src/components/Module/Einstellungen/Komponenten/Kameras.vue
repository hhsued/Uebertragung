 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card
      q-card-section
        q-toolbar
          q-toolbar-title Kameras
          q-btn(icon="add", flat, dense, @click="on_neu")
          q-btn(icon="save", flat, dense, @click="on_speichern")
      q-card-section
        q-list
          q-item(v-for="(Kamera, KIndex) in Kameras", :key="KIndex")
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
  Name: 'Einstellungen_Kameras',
  components: { Quellen, Szenen },
  data: () => ({
    Registerkarten: 'Kameras',
    Kameras: {}
  }),
  mounted () {
    this.Kameras = this.$E.Daten_laden('Basis', 'Kameras')
  },
  methods: {
    on_neu () {
      this.Kameras.push({ Name: '', Hilfstext: '', Quelle: '' })
    },
    on_speichern () {
      this.$E.Daten_speichern('Basis', 'Kameras', this.Kameras)
    },
    on_Kamera_loeschen (Index) {
      this.$q.dialog({
        title: 'Kamera löschen',
        message: 'Möchtest Du diese Kamera wirklich löschen: ' + this.Kameras[Index].Name,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.Kameras.splice(Index, 1)
      })
    }
  }
}
</script>
