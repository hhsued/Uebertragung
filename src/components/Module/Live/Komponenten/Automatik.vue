<template lang="pug">
q-page-sticky(
  position="top-right",
  :offset="[18, 18]")
  q-btn(
    fab,
    icon="timer",
    :color="this.$store.state.app.Automatik ? 'green-5' : 'primary'",
    @click="on_Automatik")
</template>

<script>
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: [],
  components: { },
  data: () => ({
  }),
  watch: {
  },
  mounted () {
  },
  methods: {
    on_Automatik () {
      switch (this.$store.state.app.Automatik) {
        case true:
          this.$q.dialog({
            title: 'Automatik deaktivieren',
            message: 'Möchtest Du die Automatik wirklich deaktivieren?',
            cancel: true,
            persistent: true
          }).onOk(() => {
            this.$store.commit('app/Automatik', false)
            this.$emit('Automatik', false)
          }).onCancel(() => {
            this.$store.commit('app/Automatik', true)
            this.$emit('Automatik', true)
          })
          break
        case false:
          this.$q.dialog({
            title: 'Automatik aktivieren',
            message: 'Möchtest Du die Automatik wirklich einschalten?',
            cancel: true,
            persistent: true
          }).onOk(() => {
            this.$store.commit('app/Automatik', true)
            this.$emit('Automatik', true)
          }).onCancel(() => {
            this.$store.commit('app/Automatik', false)
            this.$emit('Automatik', false)
          })
          break
      }
    }
  }
}
</script>
