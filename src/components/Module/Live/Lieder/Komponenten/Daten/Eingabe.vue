
<template lang="pug">
span
  q-toolbar
    q-toolbar-title Lieder-Eingabe
    q-space
    q-space
    q-btn(icon="clear", unelevated, @click="on_Aktion('loeschen')", dense)
    q-btn(icon="input", unelevated, @click="on_Aktion('laden')", dense)
    q-btn(icon="save", unelevated, @click="on_Aktion('speichern')", dense)
  q-input(
    dense,
    label="Nummer",
    hint="ggf. auch Herkunft des Liedes",
    v-model="Nummer",
    @input="on_Eingabe"
  )
  q-input(label="Titel", v-model="Titel", @input="on_Eingabe", dense)
  q-select(
    dense,
    @input="on_Eingabe",
    v-if="Nummer.length > 0 && Nummer !== '0'",
    label="Art",
    v-model="Art",
    :options="$store.state.Lieder.Liederarten"
  )
</template>
<script>
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: {},
  data: () => ({
    Nummer: '',
    Titel: '',
    Art: '',
    Zeituhr: null,
    nicht_speichern: ['Zeituhr', 'nicht_speichern']
  }),
  watch: {
  },
  beforeDestroy () {
  },
  mounted () {
  },
  methods: {
    on_Aktion (Aktion, Wert = null, GlobalerSpeicher = 'Lieder', Was = 'Eingabe') {
      switch (Aktion) {
        case 'loeschen':
          this.$Helfer.loeschen(this.$data)
          this.$store.commit('Lieder/setze', { Nummer: '', Art: '' })
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
      if (this.Nummer !== '' && this.Titel !== '' && this.Art !== '') {
        clearTimeout(this.Zeituhr)
        this.Zeituhr = setTimeout(() => {
          this.$store.commit('Lieder/setze',
            { Nummer: this.Nummer, Titel: this.Titel, Erfassungsmodus: 'Eingabe', Art: this.Art })
          this.$emit('eingegeben')
        }, 2000)
      }
    }
  }
}
</script>
