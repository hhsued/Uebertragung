<template lang="pug">
q-btn-group(
  style="margin-left: 10%; margin-right:10%;"
  spread, push)
  q-btn(
    v-if="Live",
    icon="play_arrow",
    unelevated,
    @click="$emit('Aktion','Live')")
    q-tooltip Live
  q-btn(
    v-if="Vorschau",
    icon="visibility",
    unelevated,
    @click="$emit('Aktion','Vorschau')")
    q-tooltip Vorschau
  q-btn(
    v-if="loeschen",
    icon="delete_outline",
    unelevated,
    @click="$emit('Aktion','loeschen')")
    q-tooltip löschen
  q-btn(
    v-if="bearbeiten",
    icon="edit",
    unelevated,
    @click="$emit('Aktion','bearbeiten')")
    q-tooltip bearbeiten
</template>

<script>

export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {
    Live: {
      type: Boolean,
      required: false,
      default: true
    },
    Vorschau: {
      type: Boolean,
      required: false,
      default: true
    },
    loeschen: {
      type: Boolean,
      required: false,
      default: false
    },
    bearbeiten: {
      type: Boolean,
      required: false,
      default: false
    }
  },
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
