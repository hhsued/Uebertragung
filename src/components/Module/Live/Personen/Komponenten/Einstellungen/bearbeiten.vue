 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card(style="min-width: 400px")
      q-card-section
        q-toolbar
          q-toolbar-title Personen
          q-btn(icon="add", unelevated, @click="on_neue_Person", dense)
      q-card-section
        q-select(
          v-model="Filter",
          :options="Filterwerte",
          label="Filter",
          @input="on_Filtern"
        )
      q-card-section(v-if="bearbeiten")
        q-toolbar
          q-space
          q-btn(icon="close", unelevated, @click="bearbeiten = false", dense)
          q-btn(icon="save", unelevated, @click="on_speichern", dense)
        q-input(label="Vorname", v-model="Vorname")
        q-input(label="Nachname", v-model="Nachname")
        q-select(label="Bereich", :options="Filterwerte", v-model="Bereich")
          template(v-slot:after)
            q-btn(icon="add", unelevated, @click="on_neuer_Bereich", dense)
        q-select(label="Amt", :options="Ämter", v-model="Amt")
        q-input(label="Zusatz", v-model="Zusatz")
      q-card-section(v-if="!bearbeiten")
        q-list(separator)
          q-item(v-for="(Person, Index) in gefilterte_Personen", :key="Index")
            q-item-section(avatar)
              q-btn(
                icon="delete",
                unelevated,
                @click="on_loeschen(Index)",
                dense
              )
              q-btn(
                icon="edit",
                unelevated,
                @click="on_bearbeiten(Index)",
                dense
              )
            q-item-section
              | {{ Person }}
</template>
<script>
const gmodDS = require('fs')

import Quellen from './../../../../../Einzelkomponenten/Quellen'
import Szenen from './../../../../../Einzelkomponenten/Szenen'

export default {
  name: 'Einstellungen_Personen',
  components: { Quellen, Szenen },
  props: {
    Dialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    bearbeiten: false,
    Index: -1,
    Vorname: '',
    Nachname: '',
    Amt: '',
    Bereich: '',
    Zusatz: '',
    gefilterte_Personen: [],
    Filterwerte: ['ohne'],
    Filter: 'ohne',
    Ämter: ['ohne', 'Diakon', 'Priester', 'Evangelist', 'Hirte', 'Bezirksevangelist', 'Bezirksältester', 'Bischof', 'Apostel', 'Bezirksapostelhelfer', 'Bezirksapostel', 'Stammapostelhelfer', 'Stammapostel']
  }),
  mounted () {
    this.on_Filtern()
  },
  methods: {
    on_Filtern () {
      this.gefilterte_Personen = []
      this.Filterwerte = ['ohne']
      const lobjPersonen = JSON.parse(gmodDS.readFileSync(this.$store.state.Personen.Datenpfad, 'utf-8'))
      lobjPersonen.forEach(lobjPerson => {
        if (!this.Filterwerte.includes(lobjPerson.Bereich)) {
          this.Filterwerte.push(lobjPerson.Bereich)
        }
        if (this.Filter === 'ohne') {
          this.gefilterte_Personen.push(lobjPerson.Nachname + ', ' + lobjPerson.Vorname)
        } else {
          if (lobjPerson.Bereich === this.Filter) {
            this.gefilterte_Personen.push(lobjPerson.Nachname + ', ' + lobjPerson.Vorname)
          }
        }
      })
    },
    on_neuer_Bereich () {
      this.$q.dialog({
        title: 'Neuer Bereich',
        message: 'Wie ist die Bezeichnung des neuen Bereichs',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(lstrNeuerBereich => {
        this.Filterwerte.push(lstrNeuerBereich)
        this.Bereich = lstrNeuerBereich
      })
    },
    on_neue_Person () {
      this.Index = -1
      this.bearbeiten = true
      this.Vorname = ''
      this.Nachname = ''
      this.Bereich = ''
      this.Amt = ''
      this.Zusatz = ''
    },
    on_bearbeiten (Index) {
      this.Index = Index
      const larrPerson = this.gefilterte_Personen[this.Index].split(',')
      larrPerson[1] = larrPerson[1].replace(' ', '')
      JSON.parse(gmodDS.readFileSync(this.$store.state.Personen.Datenpfad, 'utf-8')).forEach(lobjDatensatz => {
        if (lobjDatensatz.Vorname === larrPerson[1] && lobjDatensatz.Nachname === larrPerson[0]) {
          this.Vorname = lobjDatensatz.Vorname
          this.Nachname = lobjDatensatz.Nachname
          this.Bereich = lobjDatensatz.Bereich
          this.Amt = lobjDatensatz.Amt
          this.Zusatz = lobjDatensatz.Zusatz
        }
      })

      this.bearbeiten = true
    },
    on_loeschen (Index) {
      this.$q.dialog({
        title: 'Person löschen',
        message: 'Möchtest Du wirklich die folgende Person löschen: ' + this.gefilterte_Personen[Index],
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.gefilterte_Personen.splice(Index, 1)
        const lobjPersonen = JSON.parse(gmodDS.readFileSync(this.$store.state.Personen.Datenpfad, 'utf-8'))
        lobjPersonen.splice(Index, 1)
        gmodDS.writeFileSync(this.$store.state.Personen.Datenpfad, JSON.stringify(lobjPersonen), 'utf-8')
        this.$q.notify('Daten gespeichert')
        this.on_Filtern()
      })
    },
    on_speichern () {
      const lobjPersonen = JSON.parse(gmodDS.readFileSync(this.$store.state.Personen.Datenpfad, 'utf-8'))
      if (this.Index === -1) {
        const lobjPerson = { Vorname: this.Vorname, Nachname: this.Nachname, Bereich: this.Bereich, Zusatz: this.Zusatz, Amt: this.Amt }
        lobjPersonen.push(lobjPerson)
        this.Filter = 'ohne'
        this.on_Filtern()
      } else {
        lobjPersonen[this.Index].Vorname = this.Vorname
        lobjPersonen[this.Index].Nachname = this.Nachname
        lobjPersonen[this.Index].Bereich = this.Bereich
        lobjPersonen[this.Index].Zusatz = this.Zusatz
        lobjPersonen[this.Index].Amt = this.Amt
      }

      gmodDS.writeFileSync(this.$store.state.Personen.Datenpfad, JSON.stringify(lobjPersonen), 'utf-8')
      this.$q.notify('Daten gespeichert')
      this.on_Filtern()
    }

  }
}
</script>
