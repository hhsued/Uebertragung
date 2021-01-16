
<template lang="pug">
q-card
  q-card-section
    Werkzeugleiste(Titel="Person bearbeiten",
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
const gmodDS = require('fs')
import Werkzeugleiste from './../../../../../Einzelkomponenten/Werkzeugleiste'
export default {
  name: 'live_Personen_neu',
  props: ['Person'],
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
    Person (NeuerWert) {
      this.laden(this.Person)
    }
  },
  mounted () {
  },

  methods: {
    laden (Person) {
      const lobjPerson = JSON.parse(gmodDS.readFileSync(this.$store.state.Personen.Werte.Datenpfad, 'utf-8'))[Person]
      this.Vorname = Person.split(',')[1]
      this.Nachname = Person.split(',')[0]
      this.Amt = lobjPerson.Amt
      this.Bereich = lobjPerson.Bereich
      this.Zusatz = lobjPerson.Zusatz
    },
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
