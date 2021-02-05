
<template lang="pug">
q-toolbar(style="padding-top: 5px; padding-bottom: 5px")
  q-toolbar-title
    .text-h6 {{ Titel }}
  q-btn(dense, v-if="Einstellungen", icon="settings", round, flat, @click="")
    q-tooltip Einstellungen für diese Karte
  q-btn(
    dense,
    v-if="Speichern",
    icon="save",
    unelevated,
    @click="$emit('speichern')"
  )
    q-tooltip Änderungen speichern
  q-btn(
    dense,
    v-if="Schliessen",
    icon="close",
    unelevated,
    @click="$emit('schliessen')"
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
