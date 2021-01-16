
<template lang="pug">
  div
    .row
      .col
        q-card
          q-card-section
            Werkzeugleiste(Titel="Allgemein")
          q-separator
          q-card-section
            Ausgabe(
              v-if="$store.state.Allgemein.Hinweis && $store.state.Allgemein.Hinweistext.length > 4",
              GlobalerSpeicher="Allgemein"
              @Perspektive="Standardperspektive = $event",
              @Aktion="on_Aktion")
          q-card-section
            Daten
</template>

<script>
import Daten from './Daten/Daten'
import Ausgabe from './../../../../Einzelkomponenten/Ausgabe'
import Werkzeugleiste from './../../../../Einzelkomponenten/Werkzeugleiste'
export default {
  name: 'Allgemein_Steuerung',
  props: [],
  components: { Ausgabe, Werkzeugleiste, Daten },
  data: () => ({
    Standardperspektive: true
  }),
  watch: {
  },
  mounted () {
  },
  methods: {
    säubere_Text (Text) {
      let lstrText = Text.replace(/&nbsp;/g, '')
      lstrText = lstrText.replace(/<div>/g, '\n')
      lstrText = lstrText.replace(/<\/div>/g, '')
      lstrText = lstrText.replace(/<span style="color: inherit;">/g, '')
      lstrText = lstrText.replace(/<\/span>/g, '')
      return lstrText
    },
    on_Aktion (Aktion) {
      const lstrSzene = this.$E.Daten_laden('Allgemein', 'Szenen', 'Hinweistext')
      const larrQuellen = this.$E.Daten_laden('Allgemein', 'Quellen')
      const lobjAnsichtskonfiguration = [{
        Typ: 'Text_Hintergrund',
        Textquelle: larrQuellen.Hinweistext,
        Szene: lstrSzene,
        Text: this.säubere_Text(this.$store.state.Allgemein.Hinweistext),
        Schriftart: 'Arial',
        Schriftgröße: 60,
        Unten: 50,
        Oben: 10,
        Links: 960,
        Hintergrundquelle: larrQuellen.Hinweistext_Hintergrund
      }]

      this.$Helfer.Aktionen(
        Aktion,
        lstrSzene,
        'Allgemein',
        this.Standardperspektive,
        this.$store,
        lobjAnsichtskonfiguration)
    }
  }
}
</script>
