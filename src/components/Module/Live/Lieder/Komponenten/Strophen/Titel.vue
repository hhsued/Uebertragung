<template lang="pug">
q-card-section
  q-list
    q-item
      q-item-section
        .text-h6(v-if="!bearbeiten") {{ Titel }}
        q-input(v-if="bearbeiten", v-model="Titel", label="Titel")
</template>

<script>
export default {
  name: 'live_Strophen',
  props: ['Nummer'],
  components: {},
  data: () => ({
    Titel: '',
    bearbeiten: false
  }),
  mounted () {
  },
  watch: {
    Nummer: {
      immediate: true,
      handler (NeuerWert, AlterWert) {
        this.Titel = this.$store.state.Lieder.Titel
      }
    }
  },
  methods: {
    on_bearbeiten () {
      if (this.bearbeiten) {
        this.bearbeiten = false
        this.$store.commit('Lieder/setze', { Titel: this.Titel })
        this.$emit('speichern')
      } else {
        this.bearbeiten = true
      }
    }
  }
}
</script>
