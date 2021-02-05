
<template lang="pug">
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
  name: 'Einzelkomponenten_Szenen',
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
    Wert: ''
  }),
  watch: {
    value (Neuer_Wert) {
      this.Wert = Neuer_Wert
    }
  },
  mounted () {
    this.lokale_Beschriftung = this.Beschriftung.charAt(0).toUpperCase() + this.Beschriftung.slice(1)
    this.Wert = this.value
    this.Optionen = this.$obs.Szenen()
  },
  methods: {
    on_Eingabe () {
      this.$emit('input', this.Wert)
    },
    on_neue_Szene () {
      this.$q.dialog({
        title: 'Neue Szene anlegen',
        message: 'Wie soll der Name der neuen Szene lauten',
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
