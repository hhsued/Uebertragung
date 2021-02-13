<template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card(style="min-width: 400px")
      q-card-section
        q-toolbar
          q-toolbar-title Textwort
      q-card-section(v-if="bearbeiten")
        q-toolbar
          q-space
          q-btn(icon="close", unelevated, @click="on_Abbruch", dense)
          q-btn(icon="save", unelevated, @click="on_speichern", dense)
        Editor(v-model="Text")
      q-card-section(v-if="!bearbeiten")
        .row
          .col(style="margin: 10px")
            q-select(
              label="Buch",
              v-model="Buch",
              :options="Buecher",
              @input="on_Buch"
            )
          .col(v-if="Buch", style="margin: 10px")
            q-select(
              label="Kapitel",
              v-model="dasKapitel",
              :options="dieKapitel",
              @input="on_Kapitel"
            )
        .row(v-if="Verse.length > 0")
          .col
            q-list
              q-item(v-for="(Vers, VIndex) in Verse", :key="VIndex")
                q-item-section(avatar)
                  q-btn(
                    icon="edit",
                    @click="on_bearbeiten(VIndex)",
                    unelevated,
                    :class="Vers[Object.keys(Vers)[0]].length > 78 && Vers[Object.keys(Vers)[0]].indexOf('<br />') === -1 ? 'text-negative' : ''",
                    dense
                  )
                q-item-section
                  b Vers Nr. {{ Object.keys(Vers)[0] }}
                  div(v-html="Vers[Object.keys(Vers)[0]]")
                  div(
                    v-if="Vers[Object.keys(Vers)[0]].length > 60 && Vers[Object.keys(Vers)[0]].indexOf('<br />') === -1"
                  )
                    b.text-negative Es könnte sein, dass dieser Vers nicht für die Anzeige optiemiert ist
</template>
<script>
const gmodDS = require('fs')
const gmodPfad = require('path')
import Quellen from './../../../../../Einzelkomponenten/Quellen'
import Szenen from './../../../../../Einzelkomponenten/Szenen'
import Editor from './../../../../../Einzelkomponenten/Editor'
export default {
  name: 'Einstellungen_Textwort',
  components: { Quellen, Szenen, Editor },
  props: ['externes_bearbeiten'],
  data: () => ({
    bearbeiten: false,
    Text: '',
    Index: -1,
    Buecher: [],
    dieKapitel: [],
    Buch: '',
    dasKapitel: '',
    Verse: []
  }),
  watch: {
    externes_bearbeiten: {
      immediate: true,
      handler (NeuerWert, AlterWert) {
        if (NeuerWert.Status) {
          this.Buch = this.$store.state.Textwort.Buch
          this.dasKapitel = this.$store.state.Textwort.dasKapitel
          this.Verse = this.$Bibel.Kapitel()
          this.on_bearbeiten(NeuerWert.Vers - 1)
          this.on_Kapitel()
          this.$emit('uebernommen')
        }
      }
    }
  },
  mounted () {
    this.Buecher = this.$Bibel.Buecher()
  },
  methods: {
    on_bearbeiten (Index) {
      this.Index = Index
      this.Text = this.Verse[Index][(Index + 1).toString()]
      this.bearbeiten = true
    },
    on_Abbruch () {
      this.bearbeiten = false
    },
    on_Kapitel () {
      this.$Bibel.lade_Kapitel(this.Buch, this.dasKapitel)
      this.Verse = this.$Bibel.Kapitel()
    },
    on_speichern () {
      this.Verse[this.Index][(this.Index + 1).toString()] = this.Text
      this.Text = ''
      const lstrDateiname = gmodPfad.join(process.cwd(), 'Daten', 'Bibel', 'Bibelinhalt', this.Buch.replace(' ', '') + '_' + this.dasKapitel + '.json')
      gmodDS.writeFileSync(lstrDateiname, JSON.stringify(this.säubere_Text(this.Verse)), 'utf-8')
      this.$q.notify('Daten gespeichert')
      this.bearbeiten = false
    },
    säubere_Text (Text) {
      Text.forEach((lobjText, Index) => {
        let lstrText = lobjText[(Index + 1).toString()]
        lstrText = lstrText.replace(/&nbsp;/g, '')
        lstrText = lstrText.replace(/<div>/g, '<br />')
        lstrText = lstrText.replace(/<\/div>/g, '')
        lstrText = lstrText.replace(/<span style="color: inherit;">/g, '')
        lstrText = lstrText.replace(/<\/span>/g, '')
        lobjText[(Index + 1).toString()] = lstrText
      })
      return Text
    },
    on_Buch () {
      this.dieKapitel = []
      for (let lintZaehler = 1; lintZaehler <= this.$Bibel.anzahl_Kapitel_zu_Buch(this.Buch); lintZaehler++) {
        this.dieKapitel.push(lintZaehler)
      }
    }

  }
}
</script>
