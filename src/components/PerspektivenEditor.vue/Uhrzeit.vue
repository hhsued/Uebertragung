
<template lang="pug">
  div(v-if="sichtbar")
    b {{lokaler_Hinweis}}
    q-input(
      v-model="Wert",
      @input="on_Eingabe",
      mask="time",
      :rules="['time']",
      dense)
      template(v-slot:append)
        q-icon.cursor-pointer(name="access_time")
          q-popup-proxy(
            transition-show="scale",
            transition-hide="scale")
            q-time(
              v-model="Wert",
              @input="")
              .row.items-center.justify-end
                q-btn(
                  v-close-popup,
                  label="Close",
                  color="primary",
                  flat)
</template>
<script>
/* eslint-disable camelcase */
export default {
  name: 'Einzelkomponenten_Uhrzeit',
  props: {
    value: {
      type: String
    },
    sichtbar: {
      type: Boolean,
      default: false
    },
    Hinweis: {
      type: String
    }
  },
  components: {},
  data: () => ({
    Wert: '',
    lokaler_Hinweis: ''
  }),
  watch: {
  },
  mounted () {
    this.Wert = this.value
    switch (this.Hinweis) {
      case 'Automatik':
        this.lokaler_Hinweis = 'ACHTUNG: Funktioniert nur, wenn die Automatik aktiv ist'
        break
    }
  },
  methods: {
    on_Eingabe () {
      this.$emit('input', this.Wert)
    }
  }
}
</script>
