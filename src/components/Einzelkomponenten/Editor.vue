<template lang="pug">
div()
    q-list
      q-item
        q-item-section(avatar)
          q-btn(icon="edit", v-if="Modus === 'anzeigen'", @click="Modus = 'bearbeiten'", unelevated)
          q-btn(icon="done", v-if="Modus === 'bearbeiten'", @click="on_Eingabe(); Modus='anzeigen'", unelevated)
        q-item-section(v-if="Modus === 'anzeigen'")
          div(v-html="Wert")
        q-item-section(v-if="Modus === 'anzeigen'")
          b Text unformatiert
          | {{Wert}}
          i Direkt nach dem Bearbeiten eines Textes findet man noch Tags wie '&#060;div&#062;' usw. Diese werden beim Speichern ersetzt bzw. entfernt. Ein Zeilenumbruch ist immer durch '&#060;br&nbsp;/&#062;' gekennzeichnet
        q-item-section(v-if="Modus === 'bearbeiten'")
          b Bitte den Text spätestens am rechten Rand durch Druck auf ENTER / RETURN umbrechen. Sonst läuft der Text aus dem Bild. Vorher kann ein Umbruch natürlich auch schon eingefügt werden werden
          q-editor(
            v-model="Wert",
            :toolbar="[]",
            style="width: 500px")
</template>

<script>
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {
    GlobalerSpeicher: {
      type: String,
      default: ''
    },
    GlobalerWert: {
      type: String,
      default: ''
    },
    value: {
      type: String
    },
    sichtbar: {
      type: Boolean
    }
  },
  components: {},
  data: () => ({
    Wert: 'Kein Wert vorhanden! Bitte eingeben!',
    Modus: 'anzeigen'
  }),
  watch: {
  },
  mounted () {
    this.Wert = this.value
  },
  methods: {
    on_Eingabe () {
      this.$emit('input', this.Wert)
      if (this.GlobalerSpeicher !== '' && this.GlobalerWert !== '') {
        this.$store.commit(this.GlobalerSpeicher + '/setze', { [this.GlobalerWert]: this.Wert })
      }
    }
  }
}
</script>
