
<template lang="pug">
q-toolbar
  q-toolbar-title
    .text-h6 {{ Titel }}
  q-btn(
    v-if="Einstellungen",
    icon="settings",
    round,
    dense,
    flat,
    @click="",
    dense
  )
    q-tooltip Einstellungen für diese Karte
  q-btn(
    v-if="Speichern",
    icon="save",
    unelevated,
    @click="$emit('speichern')",
    dense
  )
    q-tooltip Änderungen speichern
  q-btn(
    v-if="Schliessen",
    icon="close",
    unelevated,
    @click="$emit('schliessen')",
    dense
  )
    q-tooltip Ansicht schließen
</template>
<script>

export default {
  name: 'Einzelkomponenten_Werkzeugleiste',
  props: {
    Titel: {
      type: String,
      required: true
    },
    Einstellungen: {
      type: Boolean,
      default: false
    },
    Speichern: {
      type: Boolean,
      default: false
    },
    Schliessen: {
      type: Boolean,
      default: false
    }
  },
  components: {},
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
