
<template lang="pug">
q-card-section
  q-dialog(v-model="Dialog")
    q-card(style="min-width: 450px")
      q-card-section
        .text-h6 Standardperspektive:&nbsp;{{ Perspektivenname }}
      q-card-section.q-pt-none
        b Szene:&nbsp;
        | {{ Perspektivdaten.Szene }}
      q-card-section.q-pt-none
        b Aktive Quellen
        q-list(bordered, separator)
          q-item
            q-item-section Kamera
            q-item-section {{ Perspektivdaten.aktiv.Kamera }}
          q-item
            q-item-section Mikrofone
            q-item-section
              div(
                v-for="(Mikro, MAIndex) in Perspektivdaten.aktiv.Mikros",
                :key="MIndex"
              ) {{ Mikro }}
          q-item
            q-item-section Quellen
            q-item-section
              div(
                v-for="(Quelle, QAIndex) in Perspektivdaten.aktiv.Quellen",
                :key="QAIndex"
              ) {{ Quelle }}
      q-card-section.q-pt-none
        b Inaktive Quellen
        q-list(bordered, separator)
          q-item
            q-item-section Kamera
            q-item-section {{ Perspektivdaten.inaktiv.Kamera }}
          q-item
            q-item-section Mikrofone
            q-item-section
              div(
                v-for="(Mikro, MAIndex) in Perspektivdaten.inaktiv.Mikros",
                :key="MIndex"
              ) {{ Mikro }}
          q-item
            q-item-section Quellen
            q-item-section
              div(
                v-for="(Quelle, QAIndex) in Perspektivdaten.inaktiv.Quellen",
                :key="QAIndex"
              ) {{ Quelle }}
      q-card-actions(align="right")
        q-btn(flat, label="OK", color="primary", v-close-popup, dense)
  .row(style="margin-left: 5px; margin-right: 5px; border: 1px solid")
    .col-1
      q-btn.full-width(
        label="",
        :color="Perspektive ? 'green-5' : 'red-5'",
        :text-color="Perspektive ? 'white' : 'white'",
        @click="on_Modus",
        unelevated,
        dense
      )
    .col(style="cursor: pointer", @click="on_Modus")
      .text-h6.text-center Benutze Standardperspektive ->
    .col(
      :class="Perspektive ? 'bg-green-5 text-white' : 'bg-red-5 text-white'",
      @click="on_Modus",
      style="cursor: pointer"
    )
      .text-h6.text-center {{ JaNein }}
    .col-1(v-if="GlobalerSpeicher !== ''")
      q-btn.full-width(
        icon="help_outline",
        unelevated,
        @click="Dialog = !Dialog",
        dense
      )
</template>
<script>

export default {
  name: 'Einzelkomponenten_Werkzeugleiste',
  props: {
    Perspektivenname: {
      type: String,
      default: 'Standard',
      required: true
    },
    GlobalerSpeicher: {
      type: String,
      default: '',
      required: true
    }
  },
  components: {},
  data: () => ({
    Perspektive: true,
    JaNein: 'Ja',
    Dialog: false,
    Perspektivdaten: {}
  }),
  watch: {
  },
  mounted () {
    this.Perspektivdaten = this.$E.Daten_laden(this.GlobalerSpeicher, 'Perspektiven', this.Perspektivenname)
  },
  methods: {
    on_Modus () {
      if (this.Perspektive) {
        this.$emit('Perspektive', this.Perspektive)
        this.Perspektive = false
        this.JaNein = 'Nein'
      } else {
        this.Perspektive = true
        this.JaNein = 'Ja'
        this.$emit('Perspektive', this.Perspektive)
      }
    }
  }
}
</script>
