<template lang="pug">
span
  q-toolbar(style="padding-top: 5px; padding-bottom: 5px")
    q-toolbar-title Hinweise
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
  q-checkbox(v-model="Hinweis", @input="on_Aktion('global', 'Hinweis')", dense) Hinweistext
  Editor(
    v-model="Hinweistext",
    v-if="Hinweis",
    @input="on_Aktion('global', 'Hinweistext')"
  )
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
        case 'Vorgabe':
          this.Hinweis = this.$store.state.Steuerung.Vorgabe.Allgemein.Hinweis
          this.Hinweistext = this.$store.state.Steuerung.Vorgabe.Allgemein.Hinweistext
          this.$q.notify('Vorgabe geladen')
          break
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
