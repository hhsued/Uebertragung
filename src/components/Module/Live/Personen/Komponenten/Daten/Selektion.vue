<template lang="pug">
span
  q-toolbar(style="padding-top: 5px; padding-bottom: 5px")
    q-toolbar-title Personen-Selektion
    q-space
    q-space
    q-btn(icon="clear", unelevated, @click="on_Aktion('loeschen')", dense)
    q-btn(icon="input", unelevated, @click="on_Aktion('laden')", dense)
    q-btn(icon="save", unelevated, @click="on_Aktion('speichern')", dense)
    q-btn(
      dense,
      icon="list",
      unelevated,
      v-if="$store.state.Steuerung.Vorgabe !== null",
      @click="on_Aktion('Vorgabe')"
    )
  q-checkbox(
    v-if="Person !== ''",
    v-model="AutoAusblenden",
    @input="on_Auswahl"
  ) Automatisch ausblenden
  q-input(
    label="Automatisch ausblenden nach X Sekunden",
    v-if="Person !== '' && AutoAusblenden",
    v-model.number="AutoAusblendenSekunden",
    type="number",
    @input="on_Auswahl"
  )
  q-select(
    label="Zielperspektive",
    :options="['Predigt', 'Musik']",
    v-model="AutoAusblendenPerspektive",
    v-if="Person !== '' && AutoAusblenden",
    @input="on_Auswahl"
  )
  q-separator(v-if="Person !== '' && AutoAusblenden")
  hr(v-if="Person !== '' && AutoAusblenden")
  q-select(
    dense,
    v-model="Person",
    :options="$store.state.Personen.Personen",
    @input="on_Auswahl",
    label="Person"
  )
  q-select(
    dense,
    v-model="Bereich",
    :options="$store.state.Personen.Bereiche",
    label="Filter",
    @input="filtern"
  )
</template>

<script>
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: {},
  data: () => ({
    Person: '',
    Bereich: '',
    AutoAusblenden: true,
    AutoAusblendenSekunden: 30,
    AutoAusblendenPerspektive: 'Predigt'
  }),
  watch: {
  },
  beforeDestroy () {
    this.$store.commit('Personen/Cache', {
      Modus: 'Selektion',
      Person: this.Person,
      Bereich: this.Bereich,
      AutoAusblenden: this.AutoAusblenden,
      AutoAusblendenSekunden: this.AutoAusblendenSekunden,
      AutoAusblendenPerspektive: this.AutoAusblendenPerspektive
    })
  },
  mounted () {
    if (Object.keys(this.$store.state.Personen.Selektion).length > 0) {
      this.Person = this.$store.state.Personen.Selektion.Person
      this.Bereich = this.$store.state.Personen.Selektion.Bereich
      this.AutoAusblenden = this.$store.state.Personen.Selektion.AutoAusblenden
      this.AutoAusblendenSekunden = this.$store.state.Personen.Selektion.AutoAusblendenSekunden
      this.AutoAusblendenPerspektive = this.$store.state.Personen.Selektion.AutoAusblendenPerspektive
    }
  },
  methods: {
    Vorgabe_Personen () {
      const larrPersonen = []
      this.$store.state.Steuerung.Vorgabe.Personen.forEach((lobjTextwort, lintIndex) => {
        larrPersonen.push({ label: lobjTextwort.Name, value: lintIndex })
      })
      return larrPersonen
    },
    on_Aktion (Aktion, Wert = null, GlobalerSpeicher = 'Personen', Was = 'Selektion') {
      switch (Aktion) {
        case 'Vorgabe':

          this.$q.dialog({
            title: 'Welche Vorgabe',
            message: 'Welche Vorgabe soll übernommen werden?',
            options: {
              type: 'radio',
              model: 'Start',
              // inline: true
              items: this.Vorgabe_Personen()
            },
            cancel: true,
            persistent: true
          }).onOk(Auswahl => {
            this.Person = this.$store.state.Steuerung.Vorgabe.Personen[Auswahl].Name
            this.on_Auswahl()
          })
          this.$q.notify('Vorgabe geladen')
          break
        case 'loeschen':
          this.$Helfer.loeschen(this.$data)
          break
        case 'laden':
          this.$Helfer.laden(GlobalerSpeicher + '_' + Was, GlobalerSpeicher, this.$data, this.$store)
          break
        case 'speichern':
          this.$Helfer.speichern(GlobalerSpeicher + '_' + Was, this.$data)
          break
        case 'global':
          this.$store.commit(GlobalerSpeicher + '/setze', { [Wert]: this.$data[Wert] })
          break
      }
    },
    on_loeschen () {
      this.$q.dialog({
        title: 'Person löschen',
        message: 'Möchtest Du wirklich die folgende Person löschen: ' + this.Person,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$store.commit('Personen/PersonLoeschen', this.Person)
      })
    },
    on_Auswahl () {
      this.$store.commit('Personen/setze', { Person: this.Person, Bereich: this.Bereich, AutoAusblenden: this.AutoAusblenden, AutoAusblendenSekunden: this.AutoAusblendenSekunden, AutoAusblendenPerspektive: this.AutoAusblendenPerspektive })
    },
    filtern () {
      this.$store.commit('Personen/filtern', this.Bereich)
      this.Person = ''
    }
  }
}
</script>
