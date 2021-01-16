
 <template lang="pug">
  q-card(style="min-width: 800px;")
    q-card-section
      .text-center
        .text-h4 Programmversion {{$store.state.app.Version}}
    q-card-section
      .text-center
        iframe(src="https://www.hh-sued.de/videogottesdienste/anleitung-fuer-die-uebertragungen/steuerungsprogramm/", tile="Hilfe", width="100%", height="1000")
</template>
<script>
/* eslint-disable camelcase */

export default {
  name: 'Kein_OBS',
  components: { },
  data: () => ({
    Konfig: null
  }),
  mounted () {
    this.Konfig = this.$E.laden('OBS')
  },
  methods: {
  }
}
</script>
