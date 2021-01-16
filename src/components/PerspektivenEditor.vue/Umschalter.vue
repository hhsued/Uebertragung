
<template lang="pug">
q-btn-toggle(
  @input="on_Eingabe"
  spread,
  rounded,
  unelevated,
  v-model="Wert",
  toggle-color="primary",
  :options="Optionen")
</template>
<script>
/* eslint-disable camelcase */

export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {
    GlobalerSpeicher: {
      type: String
    },
    value: {
      type: String
    },
    Vorgabe: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data: () => ({
    Wert: '',
    Optionen: []
  }),
  watch: {
  },
  mounted () {
    if (this.Vorgabe) {
      this.Optionen = [{ label: 'Selektion', value: 'Selektion' }, { label: 'Eingabe', value: 'Eingabe' }, { label: 'Vorgabe', value: 'Vorgabe' }]
    } else {
      this.Optionen = [{ label: 'Selektion', value: 'Selektion' }, { label: 'Eingabe', value: 'Eingabe' }]
    }
    this.Wert = this.$store.state[this.GlobalerSpeicher].Erfassungsmodus
  },
  methods: {
    on_Eingabe () {
      this.$store.commit(this.GlobalerSpeicher + '/setze', { Erfassungsmodus: this.Wert })
      this.$emit('input', this.Wert)
    }
  }
}
</script>
