
<template lang="pug">
span
  q-toolbar
    q-toolbar-title Lieder-Selektion
    q-space
    q-btn(icon="clear", unelevated, @click="on_Aktion('loeschen')")
    q-btn(icon="input", unelevated, @click="on_Aktion('laden')")
    q-btn(icon="save", unelevated, @click="on_Aktion('speichern')")
  q-input(
    label="Nummer",
    v-model="Nummer",
    @input="on_Eingabe()")
  q-select(
    @input="on_Eingabe"
    v-if="Nummer.length > 0 && Nummer !== '0'"
    label="Art",
    v-model="Art",
    :options="$store.state.Lieder.Liederarten")
</template>
<script>

export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: {},
  data: () => ({
    Zeituhr: null,
    Nummer: '',
    Art: '',
    nicht_speichern: ['Zeituhr', 'nicht_speichern']
  }),
  watch: {
  },
  beforeDestroy () {
  },
  mounted () {
  },
  methods: {
    on_Aktion (Aktion, Wert = null, GlobalerSpeicher = 'Lieder', Was = 'Selektion') {
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
    },
    on_Eingabe () {
      if (this.Art !== '' && this.Lied !== '0' && this.Lied !== '') {
        clearTimeout(this.Zeituhr)
        this.Zeituhr = setTimeout(() => {
          this.$store.commit('Lieder/setze', { Nummer: this.Nummer, Art: this.Art, Erfassungsmodus: 'Selektion' })
          this.$emit('eingegeben')
        }, 2000)
      }
    }
  }
}
</script>
