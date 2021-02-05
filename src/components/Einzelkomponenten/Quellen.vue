
<template lang="pug">
div
  q-select(
    :label="lokale_Beschriftung",
    v-model="Wert",
    :options="Optionen",
    @input="on_Eingabe"
  )
    template(v-slot:after)
</template>
<script>
/* eslint-disable camelcase */
export default {
  name: 'Einzelkomponenten_Quellen',
  props: {
    value: {
      type: String
    },
    Beschriftung: {
      type: String
    }
  },
  components: {},
  data: () => ({
    Optionen: [],
    Wert: '',
    lokale_Beschriftung: ''
  }),
  watch: {
    value (neuer_Wert) {
      this.Wert = neuer_Wert
    }
  },
  mounted () {
    this.lokale_Beschriftung = this.Beschriftung.charAt(0).toUpperCase() + this.Beschriftung.slice(1)
    this.Wert = this.value
    this.Optionen = this.$OBS.Quellen()
  },
  methods: {
    on_Eingabe () {
      this.$emit('input', this.Wert)
    },
    on_neue_Quelle () {
      this.$q.dialog({
        title: 'Neue Quelle anlegen',
        message: 'Wie soll der Name der neuen Quelle lauten',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(daten => {

      })
    },
    on_Filter () {
      this.$q.dialog({
        title: 'Filtern',
        message: 'Bitte die zu filternden Einträge wählen:',
        options: {
          type: 'checkbox',
          model: [],
          // inline: true
          items: this.Optionen.filter
        },
        cancel: true,
        persistent: true
      }).onOk(daten => {
        this.filtern(daten)
      })
    }
  }
}
</script>
