<template lang="pug">
.col
  q-card
    q-card-section
      .text-h6.text-center Kameras
      div(v-for="(Kamera, Index) in $store.state.app.Kameras", :key="Index")
        q-btn.full-width(
          dense,
          unelevated,
          :color="Kamera.Hintergrund",
          :text-color="Kamera.Text",
          @click="on_Kamera(Index)",
          :label="Kamera.Name"
        )
          q-tooltip {{ Kamera.Hilfstext }}
    //-q-btn(
      unelevated,
      class="full-width"
      :color="$store.state.app.Kameras[Kamera].Hintergrund",
      :text-color="$store.state.app.Kameras[Kamera].Text",
      :label="Konfig.Kameras[KIndex].Name",
      @click="on_Kamera(Konfig.Kameras[KIndex].Quelle)",
      :disable="$store.state.app.Kameras[Kamera].nicht_verfuegbar")
      q-tooltip {{ Konfig.Kameras[KIndex].Hilfstext }}
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
    on_Kamera (Index) {
      this.$store.commit('app/Kamera_vorbereiten', Index)
    }
  }
}
</script>
