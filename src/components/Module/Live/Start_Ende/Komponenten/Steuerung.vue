
<template lang="pug">
  q-card(style="min-width: 300px")
    q-card-section
      q-toolbar
        q-toolbar-title Start / Ende
        q-btn(
          icon="settings",
          round,
          flat,
          @click="")
          q-tooltip Einstellungen für diese Karte
    q-separator
    q-card-section
      Ausgabesteuerung(:Taste="Taste")
    q-separator
    q-card-section
      q-toolbar
        q-toolbar-title Anzeigeoptionen
        q-space
        q-btn(icon="clear", unelevated, @click="on_Aktion('loeschen')")
        q-btn(icon="input", unelevated, @click="on_Aktion('laden')")
        q-btn(icon="save", unelevated, @click="on_Aktion('speichern')")
    q-card-section
      //- Gottesdienstart
      q-select(v-model="Art", @input="on_sichern('Art')" label="Art des Übertragungsgottesdientes", :options=" $store.state.StartEnde.Optionen.Gottesdienstarten")
    q-separator
    q-card-section
      //- Uhrzeit
      q-checkbox(v-model="Uhrzeit", disabled, @input="on_sichern('Uhrzeit')") Anzeige der Uhrzeit
      br
      //- Datum
      q-checkbox(v-model="Datum", @input="on_sichern('Datum')") Datum anzeigen
      br
      //- Startzeit
      q-checkbox(v-model="Startuhrzeit",@input="on_sichern('Startuhrzeit')") Startzeit
      br
      Uhrzeit(:sichtbar="Startuhrzeit",v-model="Startzeit",@input="on_sichern('Startzeit')")
      br(v-if="Startuhrzeit")
    q-separator
    q-card-section
      //- Hinweistext
      q-checkbox(v-model="Hinweis",@input="on_sichern('Hinweis')") Hinweis anzeigen
      Editor(v-model="Hinweistext", v-if="Hinweis",@input="on_sichern('Hinweistext')")
    q-separator
    q-card-section
      //- Text am Ende
      q-checkbox(v-model="Hinweis_Ende",@input="on_sichern('Hinweis_Ende')") Hinweis am Ende der Übertragung anzeigen
      Editor(v-if="Hinweis_Ende", v-model="Hinweis_Ende_Text",@input="on_sichern('Hinweis_Ende_Text')")
</template>

<script>
import Ausgabesteuerung from './Steuerung/Ausgabesteuerung'
import Editor from './../../../../Einzelkomponenten/Editor'
import Uhrzeit from './../../../../Einzelkomponenten/Uhrzeit'
import Szenen from './../../../../Einzelkomponenten/Szenen'
export default {
  name: 'StartEnde_Steuerung',
  props: ['Taste'],
  components: {
    Ausgabesteuerung,
    Editor,
    Uhrzeit,
    Szenen
  },
  data: () => ({
    Art: '',
    Hinweis: false,
    Hinweistext: '',
    Uhrzeit: false,
    Datum: false,
    Startuhrzeit: false,
    Startzeit: '',
    Hinweis_Ende: false,
    Hinweis_Ende_Text: ''
  }),
  watch: {
  },
  beforeDestroy () {
  },
  mounted () {
    const lobjKonfig = this.$E.Daten_laden('StartEnde', 'Start_Ende')
    this.Art = lobjKonfig.Standardwerte.Gottesdienstart
    this.on_sichern('Art')
    this.Datum = lobjKonfig.Standardwerte.Datum
    this.on_sichern('Datum')
    this.Hinweis_Ende = lobjKonfig.Standardwerte.Endetext
    this.on_sichern('Hinweis_Ende')
    this.Hinweis_Ende_Text = lobjKonfig.Standardwerte.Endetext_Text
    this.on_sichern('Hinweis_Ende_Text')
    this.Hinweis = lobjKonfig.Standardwerte.Hinweis
    this.on_sichern('Hinweis')
    this.Hinweistext = lobjKonfig.Standardwerte.Hinweistext
    this.on_sichern('Hinweistext')
    this.Startzeit = lobjKonfig.Standardwerte.Startzeit_Uhrzeit
    this.on_sichern('Startzeit')
    this.Startuhrzeit = lobjKonfig.Standardwerte.Startzeit
    this.on_sichern('Startuhrzeit')
  },
  methods: {
    on_sichern (WelchenWert) {
      this.$store.commit('StartEnde/setze', { [WelchenWert]: this.$data[WelchenWert] })
    },
    on_Aktion (Aktion, Wert = null, GlobalerSpeicher = 'StartEnde', Was = 'Selektion') {
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
    }
  }
}
</script>
