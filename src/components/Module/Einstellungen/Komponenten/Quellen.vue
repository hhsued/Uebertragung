 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card
      q-card-section
        q-toolbar
          q-toolbar-title Quellen
          q-btn(icon="add", flat, dense, @click="on_neu")
          q-btn(icon="save", flat, dense, @click="on_speichern")
      q-card-section
        q-list
          q-item(v-for="(Quelle, Index) in Object.keys(Quellen)", :key="Index")
            q-item-section(avatar)
              q-btn(
                icon="delete",
                dense,
                flat,
                @click="on_loeschen(Quelle)")
            q-item-section
              .text-h6(@click="on_aendern(Index, Quelle)") {{Quelle}}
              Quellen(Beschriftung="Quelle", v-model="Quellen[Quelle]")
</template>
<script>

import Quellen from './../../../Einzelkomponenten/Quellen'
export default {
  Name: 'Einstellungen_Quellen',
  components: { Quellen },
  data: () => ({
    Quellen: {}
  }),
  mounted () {
    this.Quellen = this.$E.Daten_laden('Basis', 'Quellen')
  },
  methods: {
    on_aendern (Index, Quelle) {
      this.$q.dialog({
        title: 'Neuer Titel',
        message: 'Bitte den neuen Namen für die Quelle \'' + Quelle + '\' eingeben',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(lstrNeuerName => {
        const lobjTemp = {}
        let lobjGesicherteDaten = {}
        Object.keys(this.Quellen).forEach(lstrQuelle => {
          if (lstrQuelle !== Quelle) {
            lobjTemp[lstrQuelle] = this.Quellen[lstrQuelle]
          } else {
            lobjGesicherteDaten = this.Quellen[lstrQuelle]
          }
        })
        lobjTemp[lstrNeuerName] = lobjGesicherteDaten
        this.Quellen = lobjTemp
      })
    },
    on_neu () {
      if (this.Quellen.ohne_Namen !== undefined) {
        this.$set(this.Quellen, 'ohne_Namen_' + (Math.floor(Math.random() * 101)).toString(), '')
      } else {
        this.$set(this.Quellen, 'ohne_Namen', '')
      }
    },
    on_speichern () {
      this.$E.Daten_speichern('Basis', 'Quellen', this.Quellen)
    },
    on_loeschen (Quelle) {
      this.$q.dialog({
        title: 'Quelle löschen',
        message: 'Möchtest Du diese Quelle wirklich löschen: ' + Quelle,
        cancel: true,
        persistent: true
      }).onOk(() => {
        const lobjTemp = {}
        Object.keys(this.Quellen).forEach(lstrQuelle => {
          if (lstrQuelle !== Quelle) {
            lobjTemp[lstrQuelle] = this.Quellen[lstrQuelle]
          }
        })
        this.Quellen = lobjTemp
        this.$q.notify('Daten gelöscht, bitte die Daten noch speichern!')
      })
    }
  }
}
</script>
