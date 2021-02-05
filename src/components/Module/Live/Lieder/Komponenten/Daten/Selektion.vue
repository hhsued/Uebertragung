
<template lang="pug">
span
  q-toolbar
    q-toolbar-title Lieder-Selektion
    q-space
    q-btn(icon="clear", unelevated, @click="on_Aktion('loeschen')", dense)
    q-btn(icon="input", unelevated, @click="on_Aktion('laden')", dense)
    q-btn(icon="save", unelevated, @click="on_Aktion('speichern')", dense)
    q-btn(
      icon="list",
      unelevated,
      dense,
      v-if="$store.state.Steuerung.Vorgabe !== null",
      @click="on_Aktion('Vorgabe')"
    )
  q-input(label="Nummer", v-model="Nummer", @input="on_Eingabe()", dense)
  q-select(
    dense,
    @input="on_Eingabe",
    v-if="Nummer.length > 0 && Nummer !== '0'",
    label="Art",
    v-model="Art",
    :options="$store.state.Lieder.Liederarten"
  )
  div(v-if="Strophen !== null")
    q-toolbar.bg-green-2
      q-toolbar-title Strophen aus der Vorgabe
    q-toolbar-title.bg-yellow-2
      q-toolbar-title(v-if="Strophen.length > 0") {{ Strophen }}
      q-toolbar-title(v-if="Strophen.length === 0") Alle
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
    Strophen: null,
    nicht_speichern: ['Zeituhr', 'nicht_speichern']
  }),
  watch: {
  },
  beforeDestroy () {
  },
  mounted () {
  },
  methods: {
    Vorgabe_Lieder () {
      const larrLieder = []
      this.$store.state.Steuerung.Vorgabe.Lieder.forEach((lobjTextwort, lintIndex) => {
        larrLieder.push({ label: lobjTextwort.Bezeichnung, value: lintIndex })
      })
      return larrLieder
    },
    on_Aktion (Aktion, Wert = null, GlobalerSpeicher = 'Lieder', Was = 'Selektion') {
      switch (Aktion) {
        case 'Vorgabe':

          this.$q.dialog({
            title: 'Welche Vorgabe',
            message: 'Welche Vorgabe soll übernommen werden?',
            options: {
              type: 'radio',
              model: 'Start',
              // inline: true
              items: this.Vorgabe_Lieder()
            },
            cancel: true,
            persistent: true
          }).onOk(Auswahl => {
            this.Nummer = this.$store.state.Steuerung.Vorgabe.Lieder[Auswahl].Nummer
            this.Art = this.$store.state.Steuerung.Vorgabe.Lieder[Auswahl].Typ
            this.Strophen = this.$store.state.Steuerung.Vorgabe.Lieder[Auswahl].Strophen
            this.on_Eingabe()
          })
          this.$q.notify('Vorgabe geladen')
          break
        case 'loeschen':
          this.$Helfer.loeschen(this.$data)
          this.$emit('strophen_unsichtbar')
          this.Strophen = null
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
      if (this.Art !== '' && this.Lied !== '0' && this.Lied !== '') {
        clearTimeout(this.Zeituhr)
        this.Zeituhr = setTimeout(() => {
          this.$store.commit('Lieder/setze', { Nummer: this.Nummer, Art: this.Art, Erfassungsmodus: 'Selektion' })
          if (this.Strophen !== null) {
            this.$store.commit('Lieder/setze', { Vorgabestrophen: this.Strophen })
          } else {
            this.$store.commit('Lieder/setze', { Vorgabestrophen: null })
          }
          this.$emit('eingegeben')
        }, 2000)
      }
    }
  }
}
</script>
