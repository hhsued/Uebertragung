<template lang="pug">
span
  q-toolbar
    q-toolbar-title Textwort-Selektion
    q-space
    q-space
    q-btn(icon="clear", unelevated, @click="on_Aktion('loeschen')")
    q-btn(icon="input", unelevated, @click="on_Aktion('laden')")
    q-btn(icon="save", unelevated, @click="on_Aktion('speichern')")
  q-select(
    label="Buch",
    v-model="Buch",
    :options="Buecher",
    @input="on_Buch()")
  q-select(
    v-if="Buch",
    label="Kapitel",
    v-model="dasKapitel",
    :options="dieKapitel",
    @input="on_Kapitel()")
  q-select(
    v-if="Buch && dasKapitel",
    label="Vers von",
    v-model="Vers_von",
    :options="Verse_von",
    @input="on_Vers_von()")
  q-select(
    v-if="Buch && dasKapitel && Vers_von",
    label="Vers bis",
    v-model="Vers_bis",
    :options="Verse_bis",
    @input="on_Vers_bis()")
</template>

<script>
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: { },
  data: () => ({
    Verse: null,
    Buch: null,
    Buecher: [],
    dasKapitel: null,
    dieKapitel: [],
    Vers_von: null,
    Verse_von: [],
    Vers_bis: null,
    Verse_bis: [],
    nicht_speichern: ['dieKapitel', 'Verse_von', 'Verse_bis', 'Buecher', 'nicht_speichern', 'Verse']
  }),
  watch: {
  },
  beforeDestroy () {
  },
  mounted () {
    this.Buecher = this.$Bibel.Buecher()
  },
  methods: {
    on_Aktion (Aktion, Wert = null, GlobalerSpeicher = 'Textwort', Was = 'Selektion') {
      switch (Aktion) {
        case 'loeschen':
          this.$Helfer.loeschen(this.$data)
          this.$emit('Aktion', { Aktion: 'neu' })
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
    on_Vers_bis () {
      this.hole('Verse')
      this.$store.commit('Textwort/setze', { Vers_von: this.Vers_von, Vers_bis: this.Vers_bis, Verse: this.Verse })
      this.$emit('Aktion', { Aktion: 'gesetzt', Verse: this.Verse })
    },
    on_Vers_von () {
      this.Verse_bis = []
      this.reinige(false, false, true)
      this.hole('Verse_bis')
      this.$store.commit('Textwort/setze', { Vers_von: this.Vers_von })
      this.Verse = this.$Bibel.hole_Verse(this.Vers_von)
      this.$store.commit('Textwort/setze', { Vers_von: this.Vers_von, Verse: this.Verse })
      this.$emit('Aktion', { Aktion: 'gesetzt', Verse: this.Verse })
    },
    on_Kapitel () {
      this.Verse_von = []
      this.reinige(false, true, true)
      this.hole('Verse_von')
      this.$store.commit('Textwort/setze', { dasKapitel: this.dasKapitel })
    },
    on_Buch () {
      this.dieKapitel = []
      this.reinige(true, true, true, true)
      this.hole('Kapitel')
      this.$store.commit('Textwort/setze', { Buch: this.Buch })
      this.$emit('Aktion', { Aktion: 'neu' })
    },
    hole (holeWas) {
      switch (holeWas) {
        case 'Kapitel':
          for (let lintZaehler = 1; lintZaehler <= this.$Bibel.anzahl_Kapitel_zu_Buch(this.Buch); lintZaehler++) {
            this.dieKapitel.push(lintZaehler)
          }
          break
        case 'Verse':
          this.Verse = this.$Bibel.hole_Verse(this.Vers_von, this.Vers_bis)
          break
        case 'Verse_von':
          for (let lintZaehler = 1; lintZaehler <= this.$Bibel.hole_Verse_anzahl(this.Buch, this.dasKapitel); lintZaehler++) {
            this.Verse_von.push(lintZaehler)
          }
          break
        case 'Verse_bis':
          for (let lintZaehler = this.Vers_von + 1; lintZaehler <= this.Verse_von.length; lintZaehler++) {
            this.Verse_bis.push(lintZaehler)
          }
          break
      }
    },
    reinige (dasKapitel = false, von = false, bis = false, Verse = false) {
      if (Verse) {
        this.Verse = []
      }
      if (dasKapitel) {
        this.dasKapitel = null
      }
      if (von) {
        this.Vers_von = null
      }
      if (bis) {
        this.Vers_bis = null
      }
    }
  }
}
</script>
