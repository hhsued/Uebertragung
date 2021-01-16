<template lang="pug">
  q-card
    q-card-section
      q-list
        q-item(v-for="(Zeile, ZIndex) in alle_Verse", :key="ZIndex")
          q-item-section(style="width:50px;", avatar)
            q-btn(icon="edit", unelevated, @click="on_bearbeiten(ZIndex)", class="full-width full-height")
          q-item-section()
            div(v-html="Zeile.Text")
            div(v-if="Zeile.Text.indexOf('<br />') === -1")
              b(class="text-negative") Es könnte sein, dass der Text noch nicht für die Anzeige vorbereitet ist (Umbrüche)
</template>

<script>
const lmodDS = require('fs')
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: ['Verse'],
  components: { },
  data: () => ({
    alle_Verse: []
  }),
  watch: {
    Verse: {
      immediate: true,
      handler (NeuerWert, AlterWert) {
        this.alle_Verse = NeuerWert
      }
    }
  },
  mounted () {
  },
  methods: {
    on_bearbeiten (Index) {
      this.$emit('bearbeiten', Index)
    },
    säubere_Text (Text) {
      let lstrText = Text.replace(/&nbsp;/g, '')
      lstrText = lstrText.replace(/<div>/g, '<br />')
      lstrText = lstrText.replace(/<\/div>/g, '')
      lstrText = lstrText.replace(/<span style="color: inherit;">/g, '')
      lstrText = lstrText.replace(/<\/span>/g, '')
      return lstrText
    },
    on_saeubern () {
      this.erweitert = false
      this.alle_Verse.forEach(lobjText => {
        lobjText.Text = this.säubere_Text(lobjText.Text)
      })
    },
    on_speichere_Verse () {
      this.$store.commit('Textwort/setze', { Werte: { Verse: this.alle_Verse } })
      this.on_saeubern()
      const larrKapitel = this.$Bibel.Kapitel()
      larrKapitel.forEach(lobjKapitel => {
        this.alle_Verse.forEach(lobjText => {
          if (parseInt(Object.keys(lobjKapitel)[0]) === lobjText.Vers) {
            lobjKapitel[Object.keys(lobjKapitel)[0]] = lobjText.Text
          }
        })
      })
      lmodDS.writeFileSync(this.$Bibel.Datei_Kapitelinhalt(this.$store.state.Textwort.Werte.Buch, this.$store.state.Textwort.Werte.Kapitel), JSON.stringify(larrKapitel), 'utf-8')
      this.$q.notify('Erfolgreich gespeichert')
    }
  }
}
</script>
