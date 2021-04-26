
<template lang="pug">
q-splitter(v-model="Trenner")
  template(v-slot:before)
    q-tabs(v-model="Registerkarten", vertical)
      q-tab(name="Steuerung", label="Steuerung")
      //-q-tab(name="Einstellungen", label="Einstellungen")
      q-tab(name="Bearbeiten", label="Bearbeiten")
      q-tab(name="Perspektiven", label="Perspektiven")
  template(v-slot:after)
    q-tab-panels(
      v-model="Registerkarten",
      animated,
      swipeable,
      vertical,
      transition-prev="jump-up",
      transition-next="jump-up"
    )
      q-tab-panel(name="Steuerung")
        Steuerung(@zeige_Einstellungen="Registerkarten = 'Einstellungen'")
      q-tab-panel(name="Einstellungen")
        Einstellungen
      q-tab-panel(name="Bearbeiten")
        bearbeiten
      q-tab-panel(name="Perspektiven")
        Perspektiven(Komponente="Personen")
</template>

<script>
import Steuerung from './Komponenten/Steuerung'
import Einstellungen from './Komponenten/Einstellungen/Einstellungen'
import bearbeiten from './Komponenten/Einstellungen/bearbeiten'
import Perspektiven from './../../../Einzelkomponenten/PerspektivenEditor'
export default {
  name: 'Personen',
  components: { Einstellungen, Steuerung, bearbeiten, Perspektiven },
  data: () => ({
    Registerkarten: 'Steuerung',
    Trenner: 10
  }),
  mounted () {
    this.$store.commit('Personen/laden')
  },
  methods: {
  }
}
</script>
