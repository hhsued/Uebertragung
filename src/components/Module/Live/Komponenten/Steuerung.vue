<template lang="pug">
.col()
  q-card
    q-card-section
      .text-h6.text-center Steuerung
      q-btn(icon="play_arrow", @click="on_Aktion('Live')", class="full-width",unelevated)
      br
      q-btn(icon="visibility", @click="on_Aktion('Vorschau')", class="full-width",unelevated)
</template>

<script>
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: { },
  data: () => ({
  }),
  watch: {
  },
  mounted () {
  },
  methods: {
    on_Aktion (Aktion) {
      const lobjSzenen = this.$E.Daten_laden('Basis', 'Szenen')
      switch (Aktion) {
        case 'Vorschau':
          this.Kamera_Mikros(lobjSzenen.Kameras)
          this.$OBS.Szene('Vorschau', lobjSzenen.Kameras)
          break
        case 'Live':
          this.Kamera_Mikros()
          this.$OBS.Szene('Live', lobjSzenen.Kameras, 3000)
          break
      }
    },
    Kamera_Mikros (Szene) {
      this.Prüfung('Mikrofone', Szene)
      this.$store.commit('app/Mikrofon_live')
      this.Prüfung('Kameras', Szene)
      this.$store.commit('app/Kamera_live')
    },
    Prüfung (Was, Szene) {
      this.$store.state.app[Was].forEach(async (lobjObjekt, lintIndex) => {
        const lobjElementDaten = await this.$OBS.Informationen('GetSceneItemProperties', lobjObjekt.Quelle, Szene)
        // Das Objekt ist unsichtbar, soll aber sichtbar sein
        if (!lobjElementDaten.visible && this.$store.state.app[Was][lintIndex].Hintergrund === 'primary') {
          this.$OBS.Sichtbarkeit(
            Szene,
            lobjObjekt.Quelle,
            true
          )
        }
        // Das Objekt ist sichtbar, soll aber unsichtbar sein
        if (lobjElementDaten.visible && this.$store.state.app[Was][lintIndex].Hintergrund === 'white') {
          this.$OBS.Sichtbarkeit(
            Szene,
            lobjObjekt.Quelle,
            false
          )
        }
        // Das Mikro ist unsichtbar, soll aber eingeschaltet werden
        if (!lobjElementDaten.visible && this.$store.state.app[Was][lintIndex].Hintergrund === 'warning') {
          this.$OBS.Sichtbarkeit(
            Szene,
            lobjObjekt.Quelle,
            true
          )
        }
      })
    }
  }
}
</script>
