<template lang="pug">
span
  q-input(label="Person", v-model="Person", @input="on_Eingabe")
  q-input(label="Zusatz", v-model="Zusatz", @input="on_Eingabe")
</template>

<script>
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: {},
  data: () => ({
    Person: '',
    Zusatz: '',
    Zeituhr: null
  }),
  watch: {
  },
  mounted () {
    this.$store.commit('Personen/setze',
      { Person: '', Zusatz: '', Erfassungsmodus: 'Eingabe' })
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
