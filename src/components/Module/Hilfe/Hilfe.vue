
<template lang="pug">
q-card(style="min-width: 800px")
  q-card-section
    .text-center
      .text-h4 Programmversion {{ $store.state.app.Version }}
  q-card-section
    q-card
      q-tabs.text-grey(
        v-model="Hilfeseiten",
        dense,
        active-color="primary",
        indicator-color="primary",
        align="justify",
        narrow-indicator
      )
        q-tab(name="Steuerungsprogramm", label="Steuerungsprogramm")
        q-tab(name="OBS", label="OBS")
        q-tab(name="YouTube", label="YouTube")
      q-separator

      q-tab-panels(v-model="Hilfeseiten", animated)
        q-tab-panel(name="Steuerungsprogramm")
          .text-h6 Steuerungsprogramm
          iframe(
            src="https://www.hh-sued.de/wiki/steuerungsprogramm/?seq_no=2",
            tile="Hilfe",
            width="100%",
            height="1000"
          )
        q-tab-panel(name="OBS")
          .text-h6 OBS
          iframe(
            src="https://www.hh-sued.de/wiki/680/?seq_no=2",
            tile="Hilfe",
            width="100%",
            height="1000"
          )
        q-tab-panel(name="YouTube")
          .text-h6 YouTube
          iframe(
            src="https://www.hh-sued.de/wiki/youtube/?seq_no=2",
            tile="Hilfe",
            width="100%",
            height="1000"
          )
</template>
<script>
/* eslint-disable camelcase */

export default {
  name: 'Kein_OBS',
  components: {},
  data: () => ({
    Konfig: null,
    Hilfeseiten: 'Steuerungsprogramm'
  }),
  mounted () {
    this.Konfig = this.$E.laden('OBS')
  },
  methods: {
  }
}
</script>
