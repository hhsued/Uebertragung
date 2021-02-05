
<template lang="pug">
span
  Eingabe(
    @Aktion="$emit('Aktion', $event)")
</template>

<script>
import Eingabe from './Eingabe'

export default {
  name: 'Allgemein_Steuerung',
  props: [],
  components: { Eingabe },
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
