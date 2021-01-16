<template lang="pug">
span
  q-toolbar
    q-toolbar-title Personen-Selektion
    q-space
    q-space
    q-btn(icon="clear", unelevated, @click="on_Aktion('loeschen')")
    q-btn(icon="input", unelevated, @click="on_Aktion('laden')")
    q-btn(icon="save", unelevated, @click="on_Aktion('speichern')")
  q-select(
    v-model="Person",
    :options="$store.state.Personen.Personen",
    @input="on_Auswahl"
    label="Person")
  q-select(
    v-model="Bereich",
    :options="$store.state.Personen.Bereiche",
    label="Filter",
    @input="filtern")
</template>

<script>
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: { },
  data: () => ({
    Person: '',
    Bereich: ''
  }),
  watch: {
  },
  beforeDestroy () {
  },
  mounted () {
  },
  methods: {
    on_Aktion (Aktion, Wert = null, GlobalerSpeicher = 'Personen', Was = 'Selektion') {
      switch (Aktion) {
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
      this.$store.commit('Personen/setze', { Person: this.Person, Bereich: this.Bereich })
    },
    filtern () {
      this.$store.commit('Personen/filtern', this.Bereich)
      this.Person = ''
    }
  }
}
</script>
