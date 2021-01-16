
<template lang="pug">
span
  Umschalter(GlobalerSpeicher="Personen")
  Eingabe(
    v-if="$store.state.Personen.Erfassungsmodus === 'Eingabe'",
    @Aktion="$emit('Aktion', $event)")
  Selektion(
    v-if="$store.state.Personen.Erfassungsmodus === 'Selektion'",
    @Aktion="$emit('Aktion', $event)")
</template>

<script>
import Umschalter from './../../../../../Einzelkomponenten/Umschalter'
import Eingabe from './Eingabe'
import Selektion from './Selektion'

export default {
  name: 'Allgemein_Steuerung',
  props: [],
  components: { Umschalter, Eingabe, Selektion },
  data: () => ({
  }),
  watch: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>
