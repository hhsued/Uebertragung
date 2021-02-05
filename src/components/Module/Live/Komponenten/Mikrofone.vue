<template lang="pug">
.col
  q-card
    q-card-section(style="padding: 0px")
      .text-h6.text-center Mikrofone
      div(
        v-for="(Mikrofon, Index) in $store.state.app.Mikrofone",
        :key="Index"
      )
        q-btn.full-width(
          dense,
          unelevated,
          :color="Mikrofon.Hintergrund",
          :text-color="Mikrofon.Text",
          :label="Mikrofon.Name",
          @click="on_Klick(Index)"
        )
          q-tooltip {{ Mikrofon.Hilfstext }}
</template>

<script>
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: {},
  data: () => ({
  }),
  watch: {
  },
  mounted () {
  },
  methods: {
    on_Klick (Index) {
      this.$store.commit('app/Mikrofon_vorbereiten', Index)
    }
  }
}
</script>
