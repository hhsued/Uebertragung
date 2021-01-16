
<template lang="pug">
q-card
  q-card-section
    Werkzeugleiste(Titel="Person hinzufügen",
    :speichern="(Nachname.length > 2 && Vorname.length > 2 && Amt !== '' && Bereich !== '')",
    schliessen,
    @speichern="on_speichern")
  q-card-section
    q-input(v-model="Nachname", autofocus, label="Nachname")
    q-input(v-model="Vorname", label="Vorname")
    q-select(v-model="Amt", :options="Aemter", label="Amt")
    q-select(v-model="Bereich",label="Bereich",:options="$store.state.Personen.Optionen.Bereiche"
      )
      template(v-slot:after)
        q-btn(round, dense, flat, icon="add", @click="on_neuer_Bereich")
    q-input(v-model="Zusatz", label="Zusatz")
      q-tooltip z.B. Vorsteher der Gemeinde XYZ
</template>

<script>
import Werkzeugleiste from './../../../../../Einzelkomponenten/Werkzeugleiste'
export default {
  name: 'live_Personen_neu',
  props: [],
  components: { Werkzeugleiste },
  data: () => ({
    Aemter: ['ohne', 'Diakon', 'Priester', 'Evangelist', 'Hirte', 'Bezirksevangelist', 'Bezirksältester', 'Bischof', 'Apostel', 'Bezirksapostel', 'Stammapostel'],
    Nachname: '',
    Vorname: '',
    Amt: '',
    Bereich: '',
    Zusatz: ''
  }),
  watch: {
  },
  mounted () {
  },

  methods: {
    on_speichern () {
      this.$store.commit('Personen/PersonHinzu',
        {
          Name: this.Nachname + ', ' + this.Vorname,
          Bereich: this.Bereich,
          Amt: this.Amt,
          Zusatz: this.Zusatz
        }
      )
      this.$q.notify({
        message: 'Person hinzugefügt'
      })
    },
    on_neuer_Bereich () {
      this.$q.dialog({
        title: 'Neuer Bereich',
        message: 'Wie ist der Name des neuen Bereichs',
        prompt: {
          model: '',
          type: 'text'
        },
        cancel: true,
        persistent: true
      }).onOk(Daten => {
        this.$store.commit('Personen/BereichHinzu', Daten)
        this.Bereich = Daten
      })
    }
  }
}
</script>
