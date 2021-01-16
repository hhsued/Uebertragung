<template lang="pug">
q-card-section
  //-Umschalter(GlobalerSpeicher="Lieder", Vorgabe)
  Umschalter(GlobalerSpeicher="Lieder")
  Eingabe(
    v-if="$store.state.Lieder.Erfassungsmodus === 'Eingabe'",
    @eingegeben="$emit('eingegeben')")
  Selektion(
    v-if="$store.state.Lieder.Erfassungsmodus === 'Selektion'",
    @eingegeben="$emit('eingegeben')")
  //-Vorgabe(v-if="$store.state.Lieder.Erfassungsmodus === 'Vorgabe'")
</template>

<script>
/* eslint-disable camelcase */
import Umschalter from './../../../../../Einzelkomponenten/Umschalter'
import Eingabe from './Eingabe'
import Selektion from './Selektion'
import Vorgabe from './Vorgabe'
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: { Umschalter, Eingabe, Selektion, Vorgabe },
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
