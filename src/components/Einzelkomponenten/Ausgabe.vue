
<template lang="pug">
span
  //-Perspektive(v-if="Perspektive", @Perspektive="$emit('Perspektive', $event)", :GlobalerSpeicher="GlobalerSpeicher", :Perspektivenname="Perspektivenname")
  Steuerung(
    @Aktion="$emit('Aktion', $event)"
    v-if="Steuerung",
    :Live="Live",
    :Vorschau="Vorschau",
    :loeschen="loeschen",
    :bearbeiten="bearbeiten"
    )
</template>
<script>

import Perspektive from './Perspektive'
import Steuerung from './Steuerung'

export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {
    Perspektivenname: {
      required: false,
      type: String,
      default: 'Standard'
    },
    GlobalerSpeicher: {
      required: false,
      type: String,
      default: 'app'
    },
    Perspektive: {
      required: false,
      type: Boolean,
      default: true
    },
    Steuerung: {
      required: false,
      type: Boolean,
      default: true
    },
    Live: {
      required: false,
      type: Boolean,
      default: true
    },
    Vorschau: {
      required: false,
      type: Boolean,
      default: true
    },
    loeschen: {
      required: false,
      type: Boolean,
      default: false
    },
    bearbeiten: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  components: { Perspektive, Steuerung },
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
