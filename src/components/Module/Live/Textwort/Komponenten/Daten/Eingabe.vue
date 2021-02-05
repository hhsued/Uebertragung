<template lang="pug">
span
  q-toolbar(style="padding-top: 5px; padding-bottom: 5px")
    q-toolbar-title Textwort-Eingabe
    q-space
    q-btn(icon="clear", unelevated, @click="on_Aktion('loeschen')", dense)
    q-btn(icon="input", unelevated, @click="on_Aktion('laden')", dense)
    q-btn(icon="save", unelevated, @click="on_Aktion('speichern')", dense)
  q-input(
    label="Buch",
    v-model="Buch",
    @input="on_Aktion('global', 'Buch')",
    dense
  )
  q-input(
    @input="on_Aktion('global', 'dasKapitel')",
    label="Kapitel",
    v-model="dasKapitel",
    v-if="Buch.length > 2",
    dense
  )
  q-input(
    @input="on_Aktion('global', 'Vers_von')",
    label="Vers von",
    v-model="Vers_von",
    v-if="dasKapitel.length !== 0",
    dense
  )
  q-input(
    @input="on_Aktion('global', 'Vers_bis')",
    label="Vers bis",
    v-model="Vers_bis",
    v-if="Vers_von !== null",
    dense
  )
  div(v-if="Vers_von !== null")
    Editor(v-model="Text", @input="on_Aktion('global', 'Text')")
</template>

<script>
import Editor from './../../../../../Einzelkomponenten/Editor'
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: { Editor },
  data: () => ({
    Buch: '',
    dasKapitel: '',
    Vers_von: null,
    Vers_bis: null,
    Text: ''
  }),
  watch: {
  },
  beforeDestroy () {
  },
  mounted () {
    this.$store.commit('Textwort/setze', { Vers_von: null, Vers_bis: null, Verse: null, dasKapitel: null, Buch: null })
    this.$emit('Eingabe')
    this.$store.commit('Textwort/setze', { Erfassungsmodus: 'Eingabe' })
  },
  methods: {
    on_Aktion (Aktion, Wert = null, GlobalerSpeicher = 'Textwort', Was = 'Eingabe') {
      switch (Aktion) {
        case 'loeschen':
          this.$Helfer.loeschen(this.$data)
          break
        case 'laden':
          this.$Helfer.laden(GlobalerSpeicher + '_' + Was, GlobalerSpeicher, this.$data, this.$store)
          if (this.Buch !== '' && this.Buch !== null) {
            this.hole('Kapitel')
          }
          if (this.dasKapitel !== '' && this.dasKapitel !== null) {
            this.hole('Verse_von')
          }
          if (this.Vers_von !== null && this.Vers_von !== '') {
            this.Verse = this.$Bibel.hole_Verse(this.Vers_von, this.Vers_bis)
            this.hole('Verse_bis')
          }
          this.$emit('Aktion', { Aktion: 'gesetzt', Verse: this.Verse })
          break
        case 'speichern':
          this.$Helfer.speichern(GlobalerSpeicher + '_' + Was, this.$data)
          break
        case 'global':
          this.$store.commit(GlobalerSpeicher + '/setze', { [Wert]: this.$data[Wert] })
          break
      }
    }
  }
}
</script>
