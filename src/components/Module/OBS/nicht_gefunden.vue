
 <template lang="pug">
span.text-center(v-if="!OBS_gestartet")
      .text-h2 Konnte nicht zu OBS verbinden!
      .text-h4 Ist OBS gestartet und stimmen die Anmelde- und Verbindungsdaten?
      br
      br
      .text-bold Folgende Verbindungsdaten sind vorhanden:
      div
        | Server:
        b {{ Konfig.Verbindung.Server }}
      div
        | Port:
        b {{ Konfig.Verbindung.Port }}
      div
        | Passwort:
        b {{ Konfig.Verbindung.Passwort }}
      .text-h5 Sollte OBS noch nicht gestartet worden sein und dieses wurde nachgeholt, so kann man einfach F5 drücken
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
