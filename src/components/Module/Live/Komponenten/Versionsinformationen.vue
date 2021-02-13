<template lang="pug">
q-card-section
  q-scroll-area(style="height: 500px")
    ul
      li
        .text-h6 1.3.0
        ul
          li
            .text-h6 Status speichern
            div Verläßt man ein Modul, so werden die darinnen eingebenen Werte nun gespeichert
          li
            .text-h6 Personenanzige
            div Blendet man den Namen einer Person ein, so kann man nun angeben, ob nach einer bestimmten Zeit der Name automatisch ausgeblendet werden soll
          li
            .text-h6 Lieder
            div Man kann nun durch die Strophen, für die Anzeige, schalten. Dabei werden die Vorgaben berücksichtig
          li
            .text-h6 Übertragung beenden
            div Es ist nun möglich, dass, blendet man den Bildschirm am Ende der Übertragung ein, dass man automatisch, nach einer bestimmten Zeit, den Stream beendet und den Stream in YouTube automatisch auf "unsichtbar" schaltet
          li
            .text-h6 YouTube
            div Probleme behoben
      li
        .text-h6 1.2.0
        ul
          li
            .text-h6 Automatik
            div Vereinfachung der Einstellungen durch weniger Parameter
            div Steuerung nach Stunde und Minute im Gegensatz zur Steuerung nur per Minute
            div Pflegen von mehreren Automatiken, welche einfach geladen werden können
          li
            .text-h6 OBS-Steuerung
            div Da es ab und zu, durch das asynchrone Verhalten von Javascript, Überholer in der Befehlsausführung gab, wurden die Befehle zur OBS-Steuerung nun auf synchrone Ausführung umgestellt
          li
            .text-h6 Vorgaben
            div Pflege von Vorgaben über https://ugd.hh-sued.de/ von jedem internetfähigem Gerät aus
            div Mehrere Vorgaben können erstellt wwerden
            div Für einzelne Abschnitte können mehrere Einstellungen gepflegt werden (z.B. mehrere Lieder)
            div Vorgaben können im Steuerungsprogramm geladen werden.
            div Neues Symbol in den einzelnen Abschnitten (drei Striche mit Punkten davor), über welches die verfügbaren Abschnitte mit den Einstellungen aus den Vorgaben gefüllt werden können
            div Nutzt man für die Lieder eines aus den Vorgaben, so werden die in den Vorgaben gewählten Strophen grün hervorgehoben
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
