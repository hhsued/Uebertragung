
<template lang="pug">
  q-card
    q-card-section
      q-toolbar
        q-toolbar-title Aufgaben
        q-space
        q-btn(icon="save", unelevated, @click="on_speichern")
    q-card-section
      q-list
        q-expansion-item(

          v-for="(Aufgabe, AIndex) in Aufgaben",
          :key="AIndex"
          switch-toggle-side
          dense
          dense-toggle
          expand-separator
          popup
          :label="AIndex"
          :icon="(Aufgabe.Status === 'Inaktiv') ? 'alarm_off':'alarm_on'")
          q-select(
            style="margin:10px;"
            label="Status",
            v-model="Aufgabe.Status",
            :options="['Aktiv', 'Inaktiv']")
          q-select(
            style="margin:10px;"
            :disable="Aufgabe.Status === 'Inaktiv'",
            label="Typ",
            v-model="Aufgabe.Typ",
            :options="['Zeitpunkt', 'Intervall_begrenzt']")
          q-input(
            style="margin:10px;"
            v-if="Aufgabe.Typ === 'Intervall_begrenzt'",
            :disable="Aufgabe.Status === 'Inaktiv'",
            label="Intervall (alle X Minuten)",
            v-model.number="Aufgabe.Intervall",
            type="number")
          q-input(
            style="margin:10px;"
            v-if="Aufgabe.Typ === 'Intervall_begrenzt'",
            :disable="Aufgabe.Status === 'Inaktiv'",
            label="Ende (Minute)",
            v-model.number="Aufgabe.Ende",
            type="number")
          q-input(
            style="margin:10px;"
            v-if="Aufgabe.Typ === 'Intervall_begrenzt' && Aufgabe.Länge !== undefined",
            :disable="Aufgabe.Status === 'Inaktiv'",
            label="Wie lange soll die Einblendung dauern (Minuten)",
            v-model.number="Aufgabe.Länge",
            type="number")
          q-input(
            style="margin:10px;"
            v-if="Aufgabe.Typ === 'Intervall_begrenzt' && Aufgabe.Nächster !== undefined",
            :disable="Aufgabe.Status === 'Inaktiv'",
            label="Nach wie vielen Minuten soll von vorne begonnen werden",
            v-model.number="Aufgabe.Nächster",
            type="number")
          q-input(
            style="margin:10px;"
            v-if="Aufgabe.Typ === 'Zeitpunkt'",
            :disable="Aufgabe.Status === 'Inaktiv'",
            label="Zeitpunkt (Minute)",
            v-model.number="Aufgabe.Zeitpunkt",
            type="number")
</template>

<script>
export default {
  name: 'Start_Ende_Optionen',
  props: ['Automatik'],
  components: { },
  data: () => ({
    Szenen: null,
    Quellen: null,
    Aufgaben: null
  }),
  watch: { },
  mounted () {
    this.Szenen = this.$E.Daten_laden('StartEnde', 'Szenen')
    this.Quellen = this.$E.Daten_laden('StartEnde', 'Quellen')
    this.Aufgaben = this.$E.laden('Aufgaben')
  },
  methods: {
    on_speichern () {
      this.$E.speichern('Aufgaben', this.Aufgaben)
      this.$q.notify('Daten gespeichert')
      this.$emit('Automatik_neu')
    }
  }
}
</script>
