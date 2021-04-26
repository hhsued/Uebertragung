<template lang="pug">
q-dialog(v-model="Dialog_sichtbar", persistent)
  q-card(style="min-width: 350px")
    q-card-section
      .Text-h6 Neue Strophe
    q-card-section.q-pt-none
      q-editor(v-model="Text")
    q-card-actions.Text-primary(align="right")
      q-btn(flat, label="Abbruch", @click="$emit('fertig', {})", dense)
      q-btn(
        flat,
        label="Hinzufügen",
        @click="$emit('fertig', { Text: Text })",
        dense
      )
</template>

<script>
export default {
  name: 'live_Strophen_neue_Strophe',
  props: ['sichtbar'],
  components: {},
  data: () => ({
    Text: '',
    Dialog_sichtbar: false
  }),
  watch: {
    sichtbar (Neu) {
      if (Neu) {
        this.Dialog_sichtbar = true
      } else {
        this.Dialog_sichtbar = false
      }
    }
  },
  mounted () {
  },

  methods: {
  }
}
</script>
