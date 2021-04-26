 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card
      q-card-section
        q-toolbar
          q-toolbar-title Szenen
          q-btn(icon="add", flat, dense, @click="on_neu")
          q-btn(icon="save", flat, dense, @click="on_speichern")
      q-card-section
        q-list
          q-item(v-for="(Szene, Index) in Object.keys(Szenen)", :key="Index")
            q-item-section(avatar)
              q-btn(
                icon="delete",
                dense,
                flat,
                @click="on_loeschen(Szene)")
            q-item-section
              .text-h6(@click="on_aendern(Index, Szene)") {{Szene}}
              Szenen(Beschriftung="Szene", v-model="Szenen[Szene]")
</template>
<script>

import Szenen from './../../../Einzelkomponenten/Szenen'
export default {
  Name: 'Einstellungen_Szenen',
  components: { Szenen },
  data: () => ({
    Szenen: {}
  }),
  mounted () {
    this.Szenen = this.$E.Daten_laden('Basis', 'Szenen')
  },
  methods: {
    on_aendern (Index, Szene) {
      this.$q.dialog({
        title: 'Neuer Titel',
        message: 'Bitte den neuen Namen für die Szene \'' + Szene + '\' eingeben',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(lstrNeuerName => {
        const lobjTemp = {}
        let lobjGesicherteDaten = {}
        Object.keys(this.Szenen).forEach(lstrSzene => {
          if (lstrSzene !== Szene) {
            lobjTemp[lstrSzene] = this.Szenen[lstrSzene]
          } else {
            lobjGesicherteDaten = this.Szenen[lstrSzene]
          }
        })
        lobjTemp[lstrNeuerName] = lobjGesicherteDaten
        this.Szenen = lobjTemp
      })
    },
    on_neu () {
      if (this.Szenen.ohne_Namen !== undefined) {
        this.$set(this.Szenen, 'ohne_Namen_' + (Math.floor(Math.random() * 101)).toString(), '')
      } else {
        this.$set(this.Szenen, 'ohne_Namen', '')
      }
    },
    on_speichern () {
      this.$E.Daten_speichern('Basis', 'Szenen', this.Szenen)
    },
    on_loeschen (Szene) {
      this.$q.dialog({
        title: 'Szene löschen',
        message: 'Möchtest Du diese Szene wirklich löschen: ' + Szene,
        cancel: true,
        persistent: true
      }).onOk(() => {
        const lobjTemp = {}
        Object.keys(this.Szenen).forEach(lstrSzene => {
          if (lstrSzene !== Szene) {
            lobjTemp[lstrSzene] = this.Szenen[lstrSzene]
          }
        })
        this.Szenen = lobjTemp
        this.$q.notify('Daten gelöscht, bitte die Daten noch speichern!')
      })
    }
  }
}
</script>
