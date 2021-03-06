
<template lang="pug">
q-card(style="min-width: 300px")
  q-card-section(style="padding: 0px")
    q-toolbar
      q-toolbar-title Start / Ende
  q-separator
  q-card-section
    Ausgabesteuerung(:Taste="Taste")
  q-separator
  q-card-section(style="padding: 0px")
    q-toolbar
      q-toolbar-title Anzeigeoptionen für das Starten der Übertragung
      q-space
      q-btn(icon="clear", unelevated, @click="on_Aktion('loeschen')", dense)
      q-btn(icon="input", unelevated, @click="on_Aktion('laden')", dense)
      q-btn(icon="save", unelevated, @click="on_Aktion('speichern')", dense)
      q-btn(
        icon="list",
        unelevated,
        v-if="$store.state.Steuerung.Vorgabe !== null",
        @click="on_Aktion('Vorgabe')"
      )
  q-card-section(style="padding-top: 0px; padding-bottom: 5px")
    //- Gottesdienstart
    q-select(
      v-model="Art",
      dense,
      @input="on_sichern('Art')",
      label="Art des Übertragungsgottesdientes",
      :options="$store.state.StartEnde.Optionen.Gottesdienstarten"
    )
  q-separator
  q-card-section(style="padding-top: 5px; padding-bottom: 5px")
    //- Uhrzeit
    q-checkbox(
      v-model="Uhrzeit",
      disabled,
      @input="on_sichern('Uhrzeit')",
      dense
    ) Anzeige der Uhrzeit
    br
    //- Datum
    q-checkbox(v-model="Datum", @input="on_sichern('Datum')", dense) Datum anzeigen
    br
    //- Startzeit
    q-checkbox(
      v-model="Startzeit_anzeigen",
      @input="on_sichern('Startzeit_anzeigen')",
      dense
    ) Startzeit
    br
    Uhrzeit(
      :sichtbar="Startzeit_anzeigen",
      v-model="Startzeit",
      @input="on_sichern('Startzeit')"
    )
    br(v-if="Startzeit_anzeigen")
  q-separator
  q-card-section(style="padding-top: 5px; padding-bottom: 5px")
    //- Hinweistext
    q-checkbox(v-model="Hinweis", @input="on_sichern('Hinweis')", dense) Hinweis anzeigen
    Editor(
      v-model="Hinweistext",
      v-if="Hinweis",
      @input="on_sichern('Hinweistext')"
    )
  q-separator
  q-card-section(style="padding-top: 5px; padding-bottom: 5px")
    .text-h6 Anzeigeoptionen für das Beenden der Übertragung
    q-checkbox(
      label="Übertragung automatisch beenden",
      dense,
      v-model="AutomatischBeenden",
      @input="on_sichern('AutomatischBeenden')"
    )
    q-input(
      label="Automatisch beenden nach X Minuten",
      dense,
      type="Number",
      v-model.number="AutomatischBeendenMinuten",
      v-if="AutomatischBeenden",
      @input="on_sichern('AutomatischBeendenMinuten')"
    )
    q-checkbox(
      label="YouTube automatisch auf privat schalten",
      dense,
      v-model="AutomatischYouTubeUnsichtbar",
      v-if="AutomatischBeenden",
      @input="on_sichern('AutomatischYouTubeUnsichtbar')"
    )
    //- Text am Ende
    br
    q-checkbox(
      v-model="Hinweis_Ende",
      @input="on_sichern('Hinweis_Ende')",
      dense
    ) Hinweis am Ende der Übertragung anzeigen
    Editor(
      v-if="Hinweis_Ende",
      v-model="Hinweis_Ende_Text",
      @input="on_sichern('Hinweis_Ende_Text')"
    )
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
    AutomatischBeenden: true,
    AutomatischBeendenMinuten: 2,
    AutomatischYouTubeUnsichtbar: true,
    Art: '',
    Hinweis: false,
    Hinweistext: '',
    Uhrzeit: false,
    Datum: false,
    Startzeit_anzeigen: false,
    Startzeit: '',
    Hinweis_Ende: false,
    Hinweis_Ende_Text: ''
  }),
  watch: {
  },
  beforeDestroy () {
    this.$store.commit('StartEnde/Cache', {
      Modus: 'Selektion',
      AutomatischBeenden: this.AutomatischBeenden,
      AutomatischBeendenMinuten: this.AutomatischBeendenMinuten,
      AutomatischYouTubeUnsichtbar: this.AutomatischYouTubeUnsichtbar,
      Art: this.Art,
      Hinweis: this.Hinweis,
      Hinweistext: this.Hinweistext,
      Uhrzeit: this.Uhrzeit,
      Datum: this.Datum,
      Startzeit_anzeigen: this.Startzeit_anzeigen,
      Startzeit: this.Startzeit,
      Hinweis_Ende: this.Hinweis_Ende,
      Hinweis_Ende_Text: this.Hinweis_Ende_Text
    })
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
    this.Startzeit_anzeigen = lobjKonfig.Standardwerte.Startzeit
    this.on_sichern('Startzeit_anzeigen')
    this.AutomatischBeenden = lobjKonfig.Standardwerte.AutomatischBeenden
    this.on_sichern('AutomatischBeenden')
    this.AutomatischBeendenMinuten = lobjKonfig.Standardwerte.AutomatischBeendenMinuten
    this.on_sichern('AutomatischBeendenMinuten')
    this.AutomatischYouTubeUnsichtbar = lobjKonfig.Standardwerte.AutomatischYouTubeUnsichtbar
    this.on_sichern('AutomatischYouTubeUnsichtbar')
    if (Object.keys(this.$store.state.StartEnde.Selektion).length > 0) {
      this.AutomatischBeenden = this.$store.state.StartEnde.Selektion.AutomatischBeenden
      this.on_sichern('AutomatischBeenden')
      this.AutomatischBeendenMinuten = this.$store.state.StartEnde.Selektion.AutomatischBeendenMinuten
      this.on_sichern('AutomatischBeendenMinuten')
      this.AutomatischYouTubeUnsichtbar = this.$store.state.StartEnde.Selektion.AutomatischYouTubeUnsichtbar
      this.on_sichern('AutomatischYouTubeUnsichtbar')
      this.Art = this.$store.state.StartEnde.Selektion.Art
      this.on_sichern('Art')
      this.Datum = this.$store.state.StartEnde.Selektion.Datum
      this.on_sichern('Datum')
      this.Hinweis_Ende = this.$store.state.StartEnde.Selektion.Hinweis_Ende
      this.on_sichern('Hinweis_Ende')
      this.Hinweis_Ende_Text = this.$store.state.StartEnde.Selektion.Hinweis_Ende_Text
      this.on_sichern('Hinweis_Ende_Text')
      this.Hinweis = this.$store.state.StartEnde.Selektion.Hinweis
      this.on_sichern('Hinweis')
      this.Hinweistext = this.$store.state.StartEnde.Selektion.Hinweistext
      this.on_sichern('Hinweistext')
      this.Startzeit = this.$store.state.StartEnde.Selektion.Startzeit
      this.on_sichern('Startzeit')
      this.Startzeit_anzeigen = this.$store.state.StartEnde.Selektion.Startzeit_anzeigen
      this.on_sichern('Startzeit_anzeigen')
    }
  },
  methods: {
    on_sichern (WelchenWert) {
      this.$store.commit('StartEnde/setze', { [WelchenWert]: this.$data[WelchenWert] })
    },
    on_Aktion (Aktion, Wert = null, GlobalerSpeicher = 'StartEnde', Was = 'Selektion') {
      const VueInstance = this
      switch (Aktion) {
        case 'Vorgabe':
          this.$q.dialog({
            title: 'Welche Vorgabe',
            message: 'Welche Vorgabe soll übernommen werden?',
            options: {
              type: 'radio',
              model: 'Start',
              // inline: true
              items: [
                { label: 'Start', value: 'Start' },
                { label: 'Ende', value: 'Ende' }
              ]
            },
            cancel: true,
            persistent: true
          }).onOk(Auswahl => {
            if (Auswahl === 'Start') {
              VueInstance.Art = VueInstance.$store.state.Steuerung.Vorgabe.Startbildschirm.Art
              VueInstance.Datum = VueInstance.$store.state.Steuerung.Vorgabe.Startbildschirm.Datum
              VueInstance.Startzeit_anzeigen = VueInstance.$store.state.Steuerung.Vorgabe.Startbildschirm.Startzeit
              VueInstance.Startzeit = VueInstance.$store.state.Steuerung.Vorgabe.Startbildschirm.Startuhrzeit
              VueInstance.Hinweis = VueInstance.$store.state.Steuerung.Vorgabe.Startbildschirm.Hinweis
              VueInstance.Hinweistext = VueInstance.$store.state.Steuerung.Vorgabe.Startbildschirm.Hinweistext
            } else {
              VueInstance.Hinweis_Ende = VueInstance.$store.state.Steuerung.Vorgabe.Endbildschirm.Hinweis_Ende
              VueInstance.Hinweis_Ende_Text = VueInstance.$store.state.Steuerung.Vorgabe.Endbildschirm.Hinweis_Ende_Text
            }
          })
          this.$q.notify('Vorgabe geladen')
          break
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
