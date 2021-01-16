<template lang="pug">
.col()
  q-card
    q-card-section
      .text-h6.text-center Perspektiven
      div(
        v-for="(Perspektive, Index) in Object.keys(Perspektiven)",
        :key="Index")
        q-btn(
          unelevated,
          class="full-width",
          :label="Perspektive",
          @click="on_Perspektive(Perspektive)")
</template>

<script>
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: { },
  data: () => ({
    Perspektiven: {}
  }),
  watch: {
  },
  mounted () {
    this.Perspektiven = this.$E.Daten_laden('Basis', 'Perspektiven')
  },
  methods: {
    on_Perspektive (Perspektive) {
      const lobjSzenen = this.$E.Daten_laden('Basis', 'Szenen')
      this.$store.commit('app/Kamera_ändern', Perspektive)
      this.$store.commit('app/Mikrofone_ändern', Perspektive)
      this.$OBS.Perspektive(
        this.Perspektiven[Perspektive].Szene,
        this.Perspektiven[Perspektive].aktiv,
        this.Perspektiven[Perspektive].inaktiv)
      this.$OBS.Szene('Vorschau', lobjSzenen.Kameras)
      this.$OBS.Szene('Live', lobjSzenen.Kameras, 2000)
    }
  }
}
</script>
