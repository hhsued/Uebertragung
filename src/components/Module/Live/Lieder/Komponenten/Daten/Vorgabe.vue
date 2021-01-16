
<template lang="pug">
span
  q-card
    q-card-section
      q-toolbar
        q-toolbar-title Vorgabe
        q-space
        q-btn(icon="clear", unelevated, @click="on_Aktion('loeschen')")
        q-btn(icon="input", unelevated, @click="on_Aktion('laden')")
        q-btn(icon="save", unelevated, @click="on_Aktion('speichern')")
    q-separator
    q-card-section
      .text-h6 Im Programm
      div(v-if="Dateien.length > 0")
        q-list(bordered,separator)
          q-item(v-for="(Datei, Index) in Dateien" :key="Index", ripple, clickable)
            q-item-section
              .text-h6 Datum - Uhrzeit: {{Datei}}
      div(v-else)
        | Im Programm ist keine Vorgabe gespeichert
    q-separator
    q-card-section
      .text-h6 Im Internet
      | Prüfung auf Dateien ist schon eingebaut

</template>
<script>
const gmodDS = require('fs')
const gmodPfad = require('path')

/* const lstrDatenpfad = gmodPfad.join(
  process.cwd(),
  'Daten', 'Liedtexte'
) */
const lstrVorgabenpfad = gmodPfad.join(process.cwd(), 'Daten', 'Einstellungen', 'Vorgaben', 'Lieder')
import Steuerung from './../../../../../Einzelkomponenten/Steuerung'
const ftp = require('basic-ftp')
export default {
  name: 'Einzelkomponenten_Umschalter',
  props: {},
  components: { Steuerung },
  data: () => ({
    Dateien: []
  }),
  watch: {
  },
  beforeDestroy () {
  },
  mounted () {
    // this.hole_vorhandene_Dateien('FTP')
    this.hole_vorhandene_Dateien('lokal')
  },
  methods: {
    async hole_vorhandene_Dateien (Typ) {
      if (Typ === 'FTP') {
        const client = new ftp.Client()
        client.ftp.verbose = true
        try {
          await client.access({
            host: 'www.hh-sued.de',
            user: 'f0137c2e',
            password: 'Nak123!FTPhhs',
            secure: false
          })
          // const larrDateien = await client.list()
        } catch (err) {
        }
        client.close()
      }
      if (Typ === 'lokal') {
        gmodDS.readdirSync(lstrVorgabenpfad).forEach(lstrDatei => {
          const ldtDateiDatum = new Date(
            parseInt(lstrDatei.substring(0, 4)),
            parseInt(lstrDatei.substring(4, 6) - 1),
            parseInt(lstrDatei.substring(6, 8)),
            parseInt(lstrDatei.substring(9, 11)),
            parseInt(lstrDatei.substring(11, 13)),
            0, 0)
          if (new Date() < ldtDateiDatum) {
            this.Dateien.push(
              this.$Helfer.Stellen(ldtDateiDatum.getDate(), 2) + '.' +
              this.$Helfer.Stellen(ldtDateiDatum.getMonth(), 2) + ':' +
              this.$Helfer.Stellen(ldtDateiDatum.getFullYear(), 4) + ' - ' +
              this.$Helfer.Stellen(ldtDateiDatum.getHours(), 2) + ':' +
              this.$Helfer.Stellen(ldtDateiDatum.getMinutes(), 2))
          }
        })
      }
    },
    on_Vorgabe_loeschen (Index) {
      this.$q.dialog({
        title: 'Lied entfernen',
        message: 'Möchtest Du wirklich das folgende Lied entfernen: ' + this.$store.state.Lieder.Vorgabe[Index].Lied,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$store.commit('Lieder/VorgabeEntfernen', Index)
      })
    }
  }
}
</script>
