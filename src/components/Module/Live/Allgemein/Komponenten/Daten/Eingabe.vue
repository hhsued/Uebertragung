<template lang="pug">
span
  q-toolbar
    q-toolbar-title Hinweise
    q-space
    q-btn(icon="clear", unelevated, @click="on_Aktion('loeschen')")
    q-btn(icon="input", unelevated, @click="on_Aktion('laden')")
    q-btn(icon="save", unelevated, @click="on_Aktion('speichern')")
  q-checkbox(v-model="Hinweis", @input="on_Aktion('global', 'Hinweis')") Hinweistext
  Editor(v-model="Hinweistext", v-if="Hinweis", @input="on_Aktion('global', 'Hinweistext')")
</template>

<script>
import Editor from './../../../../../Einzelkomponenten/Editor'
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: { Editor },
  data: () => ({
    Hinweis: false,
    Hinweistext: ''
  }),
  watch: {
  },
  beforeDestroy () {
  },
  mounted () {

  },
  methods: {
    on_Aktion (Aktion, Variable = null, GlobalerSpeicher = 'Allgemein', Erfassungsmodus = 'Eingabe') {
      switch (Aktion) {
        case 'loeschen':
          this.$Helfer.loeschen(this.$data)
          break
        case 'laden':
          this.$Helfer.laden(GlobalerSpeicher + '_' + Erfassungsmodus, GlobalerSpeicher, this.$data, this.$store)
          break
        case 'speichern':
          this.$Helfer.speichern(GlobalerSpeicher + '_' + Erfassungsmodus, this.$data)
          break
        case 'global':
          this.$store.commit(GlobalerSpeicher + '/setze', { [Variable]: this.$data[Variable] })
          break
      }
    }
  }
}
</script>
