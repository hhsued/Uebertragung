 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card
      q-card-section
          q-toolbar
            q-toolbar-title Verbindung zu OBS
            q-space
            q-btn(icon="save", unelevated, @click="on_speichern")
          q-input(label="Server", v-model="Konfig.Verbindung.Server")
          q-input(label="Port", v-model="Konfig.Verbindung.Port")
          q-input(label="Passwort", v-model="Konfig.Verbindung.Passwort")
</template>
<script>

export default {
  name: 'Einstellungen_Basis',
  components: {},
  data: () => ({
    Konfig: null
  }),
  mounted () {
    this.Konfig = this.$E.laden('obs')
  },
  methods: {
    on_speichern () {
      this.$E.speichern('obs', this.Konfig)
    }
  }
}
</script>
