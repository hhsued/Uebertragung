<template lang="pug">
span
  q-checkbox(v-if="Person !== ''", v-model="AutoAusblenden") Automatisch ausblenden
  q-input(
    label="Automatisch ausblenden nach X Sekunden",
    v-if="Person !== '' && AutoAusblenden",
    v-model.number="AutoAusblendenSekunden",
    type="number"
  )
  q-select(
    label="Zielperspektive",
    :options="['Predigt', 'Musik']",
    v-model="AutoAusblendenPerspektive",
    v-if="Person !== '' && AutoAusblenden"
  )
  q-separator(v-if="Person !== '' && AutoAusblenden")
  hr(v-if="Person !== '' && AutoAusblenden")
  q-input(label="Person", v-model="Person", @input="on_Eingabe", dense)
  q-input(label="Zusatz", v-model="Zusatz", @input="on_Eingabe", dense)
</template>

<script>
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: {},
  data: () => ({
    Person: '',
    Zusatz: '',
    Zeituhr: null,
    AutoAusblenden: true,
    AutoAusblendenSekunden: 30,
    AutoAusblendenPerspektive: 'Predigt'
  }),
  watch: {
  },
  beforeDestroy () {
    this.$store.commit('Personen/Cache', {
      Modus: 'Eingabe',
      Person: this.Person,
      Bereich: this.Bereich,
      AutoAusblenden: this.AutoAusblenden,
      AutoAusblendenSekunden: this.AutoAusblendenSekunden,
      AutoAusblendenPerspektive: this.AutoAusblendenPerspektive
    })
  },
  mounted () {
    this.$store.commit('Personen/setze',
      { Person: '', Zusatz: '', Erfassungsmodus: 'Eingabe' })
    if (Object.keys(this.$store.state.Personen.Eingabe).length > 0) {
      this.Person = this.$store.state.Personen.Eingabe.Person
      this.Bereich = this.$store.state.Personen.Eingabe.Bereich
      this.AutoAusblenden = this.$store.state.Personen.Eingabe.AutoAusblenden
      this.AutoAusblendenSekunden = this.$store.state.Personen.Eingabe.AutoAusblendenSekunden
      this.AutoAusblendenPerspektive = this.$store.state.Personen.Eingabe.AutoAusblendenPerspektive
    }
  },
  methods: {
    on_Eingabe () {
      if (this.Person !== '') {
        clearTimeout(this.Zeituhr)
        this.Zeituhr = setTimeout(() => {
          this.$store.commit('Personen/setze',
            { Person: this.Person, Zusatz: this.Zusatz, Erfassungsmodus: 'Eingabe' })
          this.$E.Sitzung_speichern('Person_Eingabe', this.$data)
          this.$emit('eingegeben')
        }, 2000)
      }
    }
  }
}
</script>
