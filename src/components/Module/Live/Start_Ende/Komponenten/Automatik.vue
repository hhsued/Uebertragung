
<template lang="pug">
q-card
  q-card-section
    q-toolbar
      q-toolbar-title Aufgaben
      q-space
      q-btn(icon="add", unelevated, @click="on_AufgabensammlungNeu", dense)
        q-tooltip Neue Aufgabensammlung erstellen
  q-card-section
    q-select(
      v-model="Aufgabensammlung",
      :options="Aufgabensammlungen",
      @input="on_Aufgabensammlung",
      label="Aufgabensammlung"
    )
  q-card-section(v-if="Aufgaben !== null")
    q-toolbar
      q-toolbar-title Aufgabensammlung: {{ Aufgabensammlung }}
      q-space
      q-btn(
        icon="save",
        unelevated,
        @click="on_AufgabensammlungSpeichern",
        dense
      )
      q-btn(
        icon="delete",
        unelevated,
        @click="on_AufgabensammlungLoeschen",
        dense
      )
    q-list
      q-expansion-item(
        v-for="(Aufgabe, AIndex) in Aufgaben",
        :key="AIndex",
        switch-toggle-side,
        dense,
        dense-toggle,
        expand-separator,
        popup,
        :label="AIndex",
        :icon="!Aufgabe.Aktiv ? 'alarm_off' : 'alarm_on'"
      )
        q-checkbox(v-model="Aufgabe.Aktiv")
          span(v-if="Aufgabe.Aktiv") Aufgabe aktiv
          span(v-if="!Aufgabe.Aktiv") Aufgabe NICHT aktiv
        div(v-if="AIndex === 'Starten'")
          b Wann startet der Stream (die Übertragung wird an YouTube gesendet)
          q-input(
            v-if="Aufgabe.Aktiv",
            v-model="Aufgabe.Zeitpunkt",
            mask="time",
            :rules="['time']",
            label="Zeitpunkt"
          )
            template(v-slot:append)
              q-icon.cursor-pointer(name="access_time")
                q-popup-proxy(transition-show="scale", transition-hide="scale")
                  q-time(v-model="Aufgabe.Zeitpunkt")
                    .row.items-center.justify-end
                      q-btn(
                        v-close-popup,
                        label="Übernehmen",
                        color="primary",
                        flat,
                        dense
                      )
        div(v-if="AIndex === 'Countdown'")
          b Zählt (in Minuten) herunter, bis die Übertragung beginnt (ein Kamerabild gesendet wird)
          q-input(
            v-if="Aufgabe.Aktiv",
            v-model="Aufgabe.Startzeit",
            mask="time",
            :rules="['time']",
            label="Startzeit"
          )
            template(v-slot:append)
              q-icon.cursor-pointer(name="access_time")
                q-popup-proxy(transition-show="scale", transition-hide="scale")
                  q-time(v-model="Aufgabe.Startzeit")
                    .row.items-center.justify-end
                      q-btn(
                        v-close-popup,
                        label="Übernehmen",
                        color="primary",
                        flat,
                        dense
                      )
          q-input(
            v-if="Aufgabe.Aktiv",
            v-model="Aufgabe.Zielzeit",
            mask="time",
            :rules="['time']",
            label="Zielzeit"
          )
            template(v-slot:append)
              q-icon.cursor-pointer(name="access_time")
                q-popup-proxy(transition-show="scale", transition-hide="scale")
                  q-time(v-model="Aufgabe.Zielzeit")
                    .row.items-center.justify-end
                      q-btn(
                        v-close-popup,
                        label="Übernehmen",
                        color="primary",
                        flat,
                        dense
                      )
        div(v-if="AIndex === 'Sondereinblendung'")
          b Zu besondere Anlässen kann alle X Minuten ein Hinweis über den Wartebildschirm eingeblendet werden. Z.B. um gesegnete Weihnachten zu wünschen!
          q-input(
            v-if="Aufgabe.Aktiv",
            v-model="Aufgabe.Startzeit",
            mask="time",
            :rules="['time']",
            label="Startzeit"
          )
            template(v-slot:append)
              q-icon.cursor-pointer(name="access_time")
                q-popup-proxy(transition-show="scale", transition-hide="scale")
                  q-time(v-model="Aufgabe.Startzeit")
                    .row.items-center.justify-end
                      q-btn(
                        v-close-popup,
                        label="Übernehmen",
                        color="primary",
                        flat,
                        dense
                      )
          q-input(
            v-if="Aufgabe.Aktiv",
            v-model="Aufgabe.Endzeit",
            mask="time",
            :rules="['time']",
            label="Endzeit"
          )
            template(v-slot:append)
              q-icon.cursor-pointer(name="access_time")
                q-popup-proxy(transition-show="scale", transition-hide="scale")
                  q-time(v-model="Aufgabe.Endzeit")
                    .row.items-center.justify-end
                      q-btn(
                        v-close-popup,
                        label="Übernehmen",
                        color="primary",
                        flat,
                        dense
                      )
          q-input(
            v-if="Aufgabe.Aktiv",
            hint="In welchem Rhythmus, nach dem Start, soll die Sondereinblendung geschehen?",
            label="Intervall (alle X Minuten)",
            type="number",
            v-model.number="Aufgabe.Intervall"
          )
          q-input(
            v-if="Aufgabe.Aktiv",
            hint="Wie viele Minuten ist die Sondereinblendung sichtbar",
            label="Wie lange soll die Sondereinblendung angezeigt werden (in Minuten)",
            type="number",
            v-model.number="Aufgabe.Länge"
          )
        div(v-if="AIndex === 'Vorspann'")
          b Wann startet der Vorfilm mit dem Logo von Hamburg-Süd! Danach wird automatisch das Live-Bild angezeigt
          q-input(
            v-if="Aufgabe.Aktiv",
            v-model="Aufgabe.Zeitpunkt",
            mask="time",
            :rules="['time']",
            label="Zeitpunkt"
          )
            template(v-slot:append)
              q-icon.cursor-pointer(name="access_time")
                q-popup-proxy(transition-show="scale", transition-hide="scale")
                  q-time(v-model="Aufgabe.Zeitpunkt")
                    .row.items-center.justify-end
                      q-btn(
                        v-close-popup,
                        label="Übernehmen",
                        color="primary",
                        flat,
                        dense
                      )
        div(v-if="AIndex === 'Sichtbar'")
          b Um wie viel Uhr wird der Stream auf dem YouTube-Kanal sichtbar für alle geschaltet
          q-input(
            v-if="Aufgabe.Aktiv",
            v-model="Aufgabe.Zeitpunkt",
            mask="time",
            :rules="['time']",
            label="Zeitpunkt"
          )
            template(v-slot:append)
              q-icon.cursor-pointer(name="access_time")
                q-popup-proxy(transition-show="scale", transition-hide="scale")
                  q-time(v-model="Aufgabe.Zeitpunkt")
                    .row.items-center.justify-end
                      q-btn(
                        v-close-popup,
                        label="Übernehmen",
                        color="primary",
                        flat,
                        dense
                      )
        div(v-if="AIndex === 'Unsichtbar'")
          b Um wie viel Uhr wird der Stream auf dem YouTube-Kanal unsichtbar geschaltet
          q-input(
            v-if="Aufgabe.Aktiv",
            v-model="Aufgabe.Zeitpunkt",
            mask="time",
            :rules="['time']",
            label="Zeitpunkt"
          )
            template(v-slot:append)
              q-icon.cursor-pointer(name="access_time")
                q-popup-proxy(transition-show="scale", transition-hide="scale")
                  q-time(v-model="Aufgabe.Zeitpunkt")
                    .row.items-center.justify-end
                      q-btn(
                        v-close-popup,
                        label="Übernehmen",
                        color="primary",
                        flat,
                        dense
                      )
        div(v-if="AIndex === 'Automatik_aus'")
          b Um wie viel Uhr wird die Automatik automatisch deaktivert, damit sie nicht im Hintergrund weiterläuft
          q-input(
            v-if="Aufgabe.Aktiv",
            v-model="Aufgabe.Zeitpunkt",
            mask="time",
            :rules="['time']",
            label="Zeitpunkt"
          )
            template(v-slot:append)
              q-icon.cursor-pointer(name="access_time")
                q-popup-proxy(transition-show="scale", transition-hide="scale")
                  q-time(v-model="Aufgabe.Zeitpunkt")
                    .row.items-center.justify-end
                      q-btn(
                        v-close-popup,
                        label="Übernehmen",
                        color="primary",
                        flat,
                        dense
                      )
</template>

<script>
const lmodDS = require('fs')
const lmodJoin = require('path').join
export default {
  name: 'Start_Ende_Optionen',
  props: ['Automatik'],
  components: {},
  data: () => ({
    Szenen: null,
    Quellen: null,
    Aufgaben: null,
    Aufgabensammlung: null,
    Aufgabensammlungen: []
  }),
  watch: {},
  mounted () {
    this.Szenen = this.$E.Daten_laden('StartEnde', 'Szenen')
    this.Quellen = this.$E.Daten_laden('StartEnde', 'Quellen')
    this.hole_Sammlungen()
    // this.Aufgaben = this.$E.laden('Aufgaben')
  },
  methods: {
    hole_Sammlungen () {
      lmodDS.readdirSync(lmodJoin(process.cwd(), 'Daten', 'Aufgaben')).forEach(lstrAufgabensammlung => {
        this.Aufgabensammlungen.push(lstrAufgabensammlung.replace('.json', ''))
      })
    },
    on_AufgabensammlungLeer () {
      return {
        Starten: {
          Aktiv: false,
          Zeitpunkt: '00:00'
        },
        Countdown: {
          Aktiv: false,
          Startzeit: '00:00',
          Zielzeit: '00:00',
          Ebene: 1
        },
        Sondereinblendung: {
          Aktiv: false,
          Startzeit: '00:00',
          Endzeit: '00:00',
          Intervall: 4,
          Länge: 1,
          Ebene: 2
        },
        Vorspann: {
          Aktiv: false,
          Zeitpunkt: '00:00',
          Ebene: 2
        },
        Sichtbar: {
          Aktiv: false,
          Zeitpunkt: '00:00'
        },
        Unsichtbar: {
          Aktiv: false,
          Zeitpunkt: '00:00'
        },
        Automatik_aus: {
          Aktiv: false,
          Zeitpunkt: '00:00'
        }
      }
    },
    on_AufgabensammlungNeu () {
      this.$q.dialog({
        title: 'Neue Aufgabensammlung',
        message: 'Wie soll der Name der neuen Aufgabensammlung lauten:',
        prompt: {
          model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(lstrName => {
        lmodDS.writeFileSync(lmodJoin(process.cwd(), 'Daten', 'Aufgaben', lstrName + '.json'), JSON.stringify(this.on_AufgabensammlungLeer()), 'utf-8')
        this.Aufgabensammlung = null
        this.Aufgabensammlungen = []
        this.Aufgaben = null
        this.hole_Sammlungen()
      })
    },
    on_Aufgabensammlung () {
      this.Aufgaben = this.$E.laden(this.Aufgabensammlung, lmodJoin(process.cwd(), 'Daten', 'Aufgaben'))
    },
    on_AufgabensammlungLoeschen () {
      this.$q.dialog({
        title: 'Aufgabensammlung löschen',
        message: 'Möchtest Du wirklich die Aufgabensammlung \'' + this.Aufgabensammlung + '\' löschen',
        cancel: true,
        persistent: true
      }).onOk(() => {
        lmodDS.unlinkSync(lmodJoin(process.cwd(), 'Daten', 'Aufgaben', this.Aufgabensammlung + '.json'))
        this.Aufgabensammlung = null
        this.Aufgabensammlungen = []
        this.Aufgaben = null
        this.hole_Sammlungen()
      })
    },
    on_AufgabensammlungSpeichern () {
      this.$E.speichern(this.Aufgabensammlung, this.Aufgaben, lmodJoin(process.cwd(), 'Daten', 'Aufgaben'))
      this.$q.notify('Daten gespeichert')
      this.$emit('Automatik_neu')
    }
  }
}
</script>
