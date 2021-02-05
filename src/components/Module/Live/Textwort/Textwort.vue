<template lang="pug">
div
  q-splitter(v-model="Trenner")
    template(v-slot:before)
      q-tabs(v-model="Registerkarten", vertical)
        q-tab(name="Steuerung", label="Steuerung")
        //-q-tab(name="Einstellungen", label="Einstellungen")
        q-tab(name="bearbeiten", label="bearbeiten")
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
          Steuerung(
            @zeige_Einstellungen="Registerkarten = 'Einstellungen'",
            @bearbeiten="on_bearbeiten($event)"
          )
        q-tab-panel(name="Einstellungen")
          Einstellungen
        q-tab-panel(name="bearbeiten")
          bearbeiten(
            :externes_bearbeiten="externes_bearbeiten",
            @uebernommen="this.externes_bearbeiten.Status = false"
          )
        q-tab-panel(name="Perspektiven")
          Perspektiven(Komponente="Textwort")
</template>

<script>
import Steuerung from './Komponenten/Steuerung'
import Einstellungen from './Komponenten/Einstellungen/Einstellungen'
import bearbeiten from './Komponenten/Einstellungen/bearbeiten'
import Perspektiven from './../../../Einzelkomponenten/PerspektivenEditor'
export default {
  name: 'Textwort',
  components: { Einstellungen, Steuerung, bearbeiten, Perspektiven },
  data: () => ({
    Registerkarten: 'Steuerung',
    externes_bearbeiten: {
      Status: false,
      Vers: -1
    },
    Trenner: 10
  }),
  mounted () {
  },
  methods: {
    on_bearbeiten (Index) {
      this.Registerkarten = 'bearbeiten'

      if (this.$store.state.Textwort.Vers_bis === null) {
        this.externes_bearbeiten.Vers = this.$store.state.Textwort.Vers_von
      } else {
        this.externes_bearbeiten.Vers = this.$store.state.Textwort.Vers_von + Index
      }

      this.externes_bearbeiten.Status = true
    }

  }
}
</script>
