
 <template lang="pug">
  q-card(style="min-width: 800px;")
    q-card-section
      .text-center
        .text-h2 Konnte nicht zu OBS verbinden!
        .text-h4 Ist OBS gestartet und stimmen die Anmelde- und Verbindungsdaten?
    q-card-section
      .text-center
        .text-bold Folgende Verbindungsdaten sind vorhanden:
    q-card-section
      .text-center
        | Server:
        b {{ Konfig.Verbindung.Server }}
    q-card-section
      .text-center
        | Port:
        b {{ Konfig.Verbindung.Port }}
    q-card-section
      .text-center
        | Passwort:
        b {{ Konfig.Verbindung.Passwort }}
    q-card-section
      .text-center
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
