
<template lang="pug">
div
  q-splitter(v-model="Trenner")
    template(v-slot:before)
      q-tabs(v-model="Registerkarten", vertical)
        q-tab(name="Steuerung", label="Steuerung")
        q-tab(name="Automatik", label="Automatik")
        q-tab(name="Einstellungen", label="Einstellungen")
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
          Steuerung(:Taste="Taste")
        q-tab-panel(name="Automatik")
          Automatik(@Automatik_neu="$emit('Automatik_neu')")
        q-tab-panel(name="Einstellungen")
          Einstellungen
</template>

<script>
import Steuerung from './Komponenten/Steuerung'
import Einstellungen from './Komponenten/Einstellungen'
import Automatik from './Komponenten/Automatik'
export default {
  name: 'Start_Ende',
  props: ['AStatus'],
  components: { Steuerung, Einstellungen, Automatik },
  data: () => ({
    Registerkarten: 'Steuerung',
    Trenner: 10,
    Taste: null
  }),
  watch: {
  },
  mounted () {
    this.$store.commit('StartEnde/laden')
  },
  methods: {

  }
}
</script>
