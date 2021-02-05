<template lang="pug">
q-page-sticky(position="top-right", :offset="[18, 18]")
  q-dialog(v-model="dialog", persistent)
    q-card(style="min-width: 350px")
      q-card-section
        .text-h6 Aufgabensammlung wählen
      q-card-section.q-pt-none
        q-select(
          label="Aufgabensammlung",
          v-model="Aufgabensammlung",
          :options="Aufgabensammlungen"
        )
      q-card-actions.text-primary(align="right")
        q-btn(flat, label="Abbruch", v-close-popup, dense)
        q-btn(
          v-if="Aufgabensammlung !== null",
          flat,
          label="Auswählen",
          v-close-popup,
          @click="on_Automatiksammlung",
          dense
        )
  q-btn(
    fab,
    dense,
    icon="timer",
    :color="this.$store.state.app.Automatik ? 'green-5' : 'primary'",
    @click="on_Automatik"
  )
</template>

<script>
const lmodDS = require('fs')
const lmodJoin = require('path').join
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: [],
  components: {},
  data: () => ({
    dialog: false,
    Aufgabensammlung: null,
    Aufgabensammlungen: []
  }),
  watch: {
  },
  mounted () {
  },
  methods: {
    on_Automatik () {
      switch (this.$store.state.app.Automatik) {
        case true:
          this.$q.dialog({
            title: 'Automatik deaktivieren',
            message: 'Möchtest Du die Automatik wirklich deaktivieren?',
            cancel: true,
            persistent: true
          }).onOk(() => {
            this.$store.commit('app/Automatik', false)
            this.$emit('Automatik', false)
          }).onCancel(() => {
            this.$store.commit('app/Automatik', true)
            this.$emit('Automatik', true)
          })
          break
        case false:
          lmodDS.readdirSync(lmodJoin(process.cwd(), 'Daten', 'Aufgaben')).forEach(lstrAufgabensammlung => {
            this.Aufgabensammlungen.push(lstrAufgabensammlung.replace('.json', ''))
          })
          this.dialog = true
          break
      }
    },
    on_Automatiksammlung () {
      this.$store.commit('app/Automatik', true)
      this.$emit('Aufgabensammlung', this.Aufgabensammlung)
      this.dialog = false
      this.$emit('Automatik', true)
    }
  }
}
</script>
