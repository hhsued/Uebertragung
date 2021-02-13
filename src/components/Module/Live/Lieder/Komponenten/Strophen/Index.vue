
<template lang="pug">
q-card(style="min-width: 300px")
  q-card-section(style="padding-top: 5px; padding-bottom: 5px")
    Werkzeugleiste(Titel="Strophen", @schliessen="$emit('verstecken')")
  q-separator
  q-card-section(style="padding-top: 5px; padding-bottom: 5px")
    Titel(:Nummer="Nummer", @speichern="on_speichern")
  //-Perspektive(
    GlobalerSpeicher="Lieder",
    :Perspektivenname="($store.state.Lieder.Art === 'Abendmahlslied') ? 'Strophen_Abendmahl' : 'Strophen_Normal'",
    @Perspektive="Standardperspektive = $event")
  Strophen(
    :Nummer="Nummer",
    @speichern="on_speichern",
    :Standardperspektive="Standardperspektive"
  )
</template>

<script>
/* eslint-disable camelcase */

const gmodPfad = require('path')
const gmodDS = require('fs')

// import neue_Strophe from './neue_Strophe'
import Werkzeugleiste from './../../../../../Einzelkomponenten/Werkzeugleiste'
import Perspektive from './../../../../../Einzelkomponenten/Perspektive'
import Strophen from './Strophen'
import Titel from './Titel'
const lstrDatenpfad = gmodPfad.join(
  process.cwd(),
  'Daten', 'Liedtexte'
)

export default {
  name: 'live_Strophen',
  props: ['Nummer'],
  components: { Werkzeugleiste, Perspektive, Strophen, Titel },
  data: () => ({
    Standardperspektive: true
  }),
  mounted () {
  },
  watch: {
    Nummer: {
      immediate: true,
      handler (NeuerWert, AlterWert) {
        this.laden()
      }
    }
  },
  methods: {
    on_speichern () {
      const lstrLiedPfad = gmodPfad.join(lstrDatenpfad, 'Gesangbuch', this.$store.state.Lieder.Werte.Nummer.toString() + '.json')
      const larrStrophen = {}
      larrStrophen.Titel = this.$store.state.Lieder.Werte.Titel
      larrStrophen.Strophen = []
      this.$store.state.Lieder.Werte.Strophen.forEach(loblStrophe => {
        larrStrophen.Strophen.push(loblStrophe.Text)
      })
      gmodDS.writeFileSync(lstrLiedPfad, JSON.stringify(larrStrophen), 'utf-8')
      this.$q.notify('Erfolgreich gespeichert')
    },
    laden () {
      const larrAnzuzeigendeStrophen = []
      if (this.$store.state.Lieder.Nummer !== '' && this.$store.state.Lieder.Nummer !== '0') {
        const larrAlleStrophen = []
        const larrVorgabeStrophen = []
        const lstrLiedPfad = gmodPfad.join(lstrDatenpfad, 'Gesangbuch', this.$store.state.Lieder.Nummer + '.json')
        const larrStophen = JSON.parse(gmodDS.readFileSync(lstrLiedPfad, 'utf-8'))
        if (this.$store.state.Lieder.Vorgabestrophen !== null) {
          if (this.$store.state.Lieder.Vorgabestrophen.indexOf(',') > 0) {
            this.$store.state.Lieder.Vorgabestrophen.split(',').forEach(lstrStrophe => {
              larrVorgabeStrophen.push(parseInt(lstrStrophe))
            })
          } else {
            if (typeof (this.$store.state.Lieder.Vorgabestrophen) === 'string' && this.$store.state.Lieder.Vorgabestrophen.length > 0) {
              larrVorgabeStrophen.push(parseInt(this.$store.state.Lieder.Vorgabestrophen))
            }
          }
        }
        for (let lintZaehler = 0; lintZaehler < larrStophen.Strophen.length; lintZaehler++) {
          const larrDaten = {}
          const lstrText = larrStophen.Strophen[lintZaehler]
          this.$set(larrDaten, 'Text', lstrText)
          if (this.$store.state.Lieder.Vorgabestrophen !== null) {
            if (larrVorgabeStrophen.length > 0) {
              if (larrVorgabeStrophen.indexOf(lintZaehler + 1) > -1) {
                this.$set(larrDaten, 'Hintergrundfarbe', 'bg-green-2')
                larrAnzuzeigendeStrophen.push(lintZaehler)
              }
            } else {
              this.$set(larrDaten, 'Hintergrundfarbe', 'bg-green-2')
              larrAnzuzeigendeStrophen.push(lintZaehler)
            }
          } else {
            if (this.$store.state.Lieder.Vorgabestrophen === null) {
              larrAnzuzeigendeStrophen.push(lintZaehler)
            }
            this.$set(larrDaten, 'Hintergrundfarbe', 'bg-white')
          }

          this.$set(larrDaten, 'Textfarbe', 'text-black')
          this.$set(larrDaten, 'Bearbeitungsmodus', false)
          larrAlleStrophen.push(larrDaten)
        }
        this.$store.commit('Lieder/setze', { Titel: larrStophen.Titel, Strophen: larrAlleStrophen, AnzuzeigendeStrophe: larrAnzuzeigendeStrophen })
      }
    },
    // ----------------------------------------------------------------
    verarbeite_Strophe (Text, Strophennummer) {
      if (Text.substring(Text.length - 6) === '<br />') {
        Text = Text.substring(Text.length - 6)
      }
      const larrStrophe = Text.split('<br />') // 6
      let lstrText = 'Lied Nr. ' + this.Lied + ' - Strophe ' + Strophennummer.toString() + '\n\n'
      larrStrophe.forEach((lstrZeile, lintIndex) => {
        lstrText += lstrZeile
        if (lintIndex < larrStrophe.length - 1) {
          lstrText += '\n'
        }
      })
      return lstrText
    },

    on_Aktion (Modus, Index) {
      switch (Modus) {
        case 'Vorschau':
          this.Werte.Strophen[Index].Hintergrundfarbe = 'bg-warning'
          this.Werte.Strophen[Index].Textfarbe = 'bg-white'
          this.Ansicht_aufbauen(Index)
          this.$OBS.Szene('Vorschau', this.Konfig.Szenen.Strophe)
          break
        case 'Live':
          this.Werte.Strophen[Index].Hintergrundfarbe = 'bg-primary'
          this.Werte.Strophen[Index].Textfarbe = 'bg-white'
          this.Ansicht_aufbauen(Index)
          if (this.Werte.Kameramodus === 'Perspektive') {
            this.on_Perspektive(this.Art)
          } else {
            this.$OBS.Szene('Vorschau', this.Konfig.Szenen.Strophe)
            this.$OBS.Szene('Live', this.Konfig.Szenen.Strophe, 1000)
          }
          break
      }
    },
    Prüfung (Was) {
      this.KonfigTechnik[Was].forEach(async lobjObjekt => {
        const lobjElementDaten = await this.$OBS.Element('Info', lobjObjekt.Quelle, this.Konfig.Szenen.Strophe)
        // Das Objekt ist unsichtbar, soll aber sichtbar sein
        if (!lobjElementDaten.visible && this.$store.state.app[Was][lobjObjekt.Quelle].Hintergrund === 'primary') {
          this.$OBS.Sichtbarkeit(
            this.Konfig.Szenen.Strophe,
            lobjObjekt.Quelle,
            true
          )
        }
        // Das Objekt ist sichtbar, soll aber unsichtbar sein
        if (lobjElementDaten.visible && this.$store.state.app[Was][lobjObjekt.Quelle].Hintergrund === 'white') {
          this.$OBS.Sichtbarkeit(
            this.Konfig.Szenen.Strophe,
            lobjObjekt.Quelle,
            false
          )
        }
        // Das Mikro ist unsichtbar, soll aber eingeschaltet werden
        if (!lobjElementDaten.visible && this.$store.state.app[Was][lobjObjekt.Quelle].Hintergrund === 'warning') {
          this.$OBS.Sichtbarkeit(
            this.Konfig.Szenen.Strophe,
            lobjObjekt.Quelle,
            true
          )
        }
      })
    },

    Kamera_Mikros () {
      this.Prüfung('Mikrofone')
      this.$store.commit('app/Mikrofon_live')
      this.Prüfung('Kameras')
      this.$store.commit('app/Kamera_live')
    },
    Ansicht_aufbauen (Index) {
      this.Kamera_Mikros()
      if (this.Art === 'Abendmahlslied') {
        this.$OBS.Sichtbarkeit(
          this.Konfig.Szenen.Strophe,
          this.Konfig.Quellen.Abendmahlsbild,
          true
        )
      } else {
        this.$OBS.Sichtbarkeit(
          this.Konfig.Szenen.Strophe,
          this.Konfig.Quellen.Abendmahlsbild,
          false
        )
      }
      this.$OBS.Text_und_Hintergrund(
        {
          Quelle: this.Konfig.Quellen.Strophe,
          Szene: this.Konfig.Szenen.Strophe,
          Text: this.verarbeite_Strophe(this.Werte.Strophen[Index].Text, Index + 1),
          Schriftart: 'Arial',
          Schriftgröße: 60,
          Unten: 10,
          Oben: 10,
          Links: 40
        },
        {
          Quelle: this.Konfig.Quellen.Strophe_Hintergrund,
          Szene: this.Konfig.Szenen.Strophe
        }
      )
    },
    on_loeschen (Index) {
      this.$q.dialog({
        title: 'Strophe löeschen',
        message: 'Wirklich löschen',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.Werte.Strophen.strophen.splice(Index, 1)
        this.Werte.Status_Strophen.splice(Index, 1)
        // this.schreibePersonenDaten()
        this.$q.notify({
          message: 'Gelöscht'
        })
      })
    },
    on_neue_Strophe () {
      this.Werte.Strophen.Strophen.push('Hier fehlt der Text')
      this.Werte.Status_Strophen.push({ aktiv: false, editModus: false })
    },
    onAktiviere (Index, Typ) {
      this.Werte.aktiver_Typ = Typ
      this.Werte.aktive_Strophe = Index + 1
      this.Werte.aktive_Stophe_Text = this.Werte.Strophen.strophen[Index].substring(0, 30) + '...'
    },
    on_hinzufuegen (Daten) {
      if (Object.keys(Daten).length > 0) {
        this.Werte.Strophen.strophen.push(Daten.Text)
      }
      this.dialoge.neueStrophe = false
    },
    lade_Daten (Lied) {
      if (Lied !== 0 && Lied !== '0') {
        this.Werte.Strophen = []
        const lstrLiedPfad = gmodPfad.join(lstrDatenpfad, 'Gesangbuch', this.Lied.toString() + '.json')
        const larrStophen = JSON.parse(gmodDS.readFileSync(lstrLiedPfad, 'utf-8'))
        this.Werte.Titel = larrStophen.Titel
        for (let lintZaehler = 0; lintZaehler < larrStophen.Strophen.length; lintZaehler++) {
          const larrDaten = {}
          const lstrText = larrStophen.Strophen[lintZaehler]
          this.$set(larrDaten, 'Text', lstrText)
          this.$set(larrDaten, 'Hintergrundfarbe', 'bg-white')
          this.$set(larrDaten, 'Textfarbe', 'text-black')
          this.$set(larrDaten, 'Bearbeitungsmodus', false)
          this.Werte.Strophen.push(larrDaten)
        }
      }
    },
    on_Perspektive (Welche) {
      if (Welche === 'Abendmahlslied') {
        Welche = 'Strophen_Abendmahl'
      } else {
        Welche = 'Strophen_Normal'
      }
      this.$store.commit('app/Kamera_ändern', this.Konfig.Perspektiven[Welche].aktiv.Kamera)
      this.$store.commit('app/Mikrofone_ändern', this.Konfig.Perspektiven[Welche].aktiv.Mikros)
      this.$OBS.Perspektive(
        this.Konfig.Perspektiven[Welche].Szene,
        this.Konfig.Perspektiven[Welche].aktiv,
        this.Konfig.Perspektiven[Welche].inaktiv)
      this.$OBS.Szene('Vorschau', this.Konfig.Szenen.Strophe)
      this.$OBS.Szene('Live', this.Konfig.Szenen.Strophe, 2000)
    }
  }
}
</script>
