<template lang="pug">
.col()
  q-card
    q-card-section
      .text-h6.text-center Übertragung
    q-card-section
      .text-center.bg-positive.text-white(v-if="$store.state.app.Übertragung_läuft")
        | AKTIV
      .text-center.bg-warning(v-else)
        | NICHT AKTIV
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
