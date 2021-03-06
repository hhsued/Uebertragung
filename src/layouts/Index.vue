<template lang="pug">
q-layout(view="hHh LpR fFf")
  q-dialog(v-model="DialogNeues", full-width)
    q-card
      q-card-section
        .text-h6 Neuerung in dieser Version
      Versionsinformationen(v-if="DialogNeues")
      q-card-actions(align="right")
        q-btn(flat, label="Schliessen", v-close-popup, dense)
  q-header.bg-primary.text-white(reveal, bordered)
    q-toolbar
      q-btn(
        flat,
        dense,
        round,
        icon="menu",
        aria-label="Menu",
        @click="Schublade_offen = !Schublade_offen"
      )
      q-toolbar-title Übertragungen
        span | (YouTube-ID: {{$store.state.app.YouTubeID}})
        span(v-if="KeinOBSAktiv")
          | &nbsp;(Kein OBS aktiv)
          q-btn(
            icon="help",
            unelevated,
            @click="KeinOBSAktiv_Dialog = !KeinOBSAktiv_Dialog"
          )
            q-tooltip Was bedeutet diese Meldung
          q-btn(icon="refresh", unelevated, @click="erneute_Pruefung")
            q-tooltip Erneut auf OBS prüfen

      //-q-btn(flat, dense, icon="add", @click="on_Test")
      div
        | {{ $store.state.app.Version }}
        q-btn(
          icon="new_releases",
          unelevated,
          @click="on_Eintrag('Neu')",
          dense
        )
          q-tooltip Was ist neu in dieser Version
        q-btn(icon="help", unelevated, @click="on_Eintrag('Hilfe')", dense)

  q-drawer(
    v-model="Schublade_offen",
    side="left",
    behavior="desktop",
    bordered
  )
    h6(style="margin-left: 20px") Optionen
    q-list(bordered, separator)
      q-item(
        clickable,
        v-ripple,
        @click="on_Eintrag('Live'); Schublade_offen = false"
      )
        q-item-section
          q-item-label Live
      q-item(
        clickable,
        v-ripple,
        @click="on_Eintrag('Vorgaben'); Schublade_offen = false"
      )
        q-item-section
          q-item-label Vorgabenpflege
      q-item(
        clickable,
        v-ripple,
        @click="on_Eintrag('Einstellungen'); Schublade_offen = false"
      )
        q-item-section
          q-item-label Einstellungen
      q-item(
        clickable,
        v-ripple,
        @click="on_Eintrag('Hilfe'); Schublade_offen = false"
      )
        q-item-section
          q-item-label Über das Programm und Hilfe
      q-item(clickable, v-ripple, @click="on_Ende")
        q-item-section
          q-item-label Programm beenden
  q-page-container
    q-dialog(v-model="KeinOBSAktiv_Dialog")
      KeinOBSAktiv
    component(:is="aktive_Komponente")
</template>

<script>

const gmodBS = require('os')
const gmodDS = require('fs')
const gmodPfad = require('path')

import Live from './../components/Module/Live/Index'
import Einstellungen from './../components/Module/Einstellungen/Index'
import KeinOBSAktiv from './../components/Module/OBS/nicht_aktiv'
import keinOBSGefunden from './../components/Module/OBS/nicht_gefunden'
import Einrichtung from './../components/Module/Einrichtung/Index'
import Hilfe from './../components/Module/Hilfe/Hilfe'
import Vorgaben from './../components/Module/Vorgaben/Index'
import Versionsinformationen from './../components/Module/Live/Komponenten/Versionsinformationen'

export default {
  name: 'MainLayout',
  components: { Live, Einstellungen, KeinOBSAktiv, Einrichtung, keinOBSGefunden, Hilfe, Vorgaben, Versionsinformationen },

  data: () => ({
    DialogNeues: false,
    aktive_Komponente: '',
    Schublade_offen: false,
    Automatik: false,
    Konfig: {},
    KeinOBSAktiv: false,
    KeinOBSAktiv_Dialog: false
  }),
  async mounted () {
    this.GitHub()
    this.neue_Version()
    this.initieren()
    this.$store.commit('app/laden')
    this.YouTube()
  },
  methods: {
    async YouTube () {
      // this.$store.commit('app/setze', { YouTubeID: await this.$YT.holeUebertragungsID() })
      const larrAuswahl = []
      const lobjUebertragungen = await this.$YT.holeUebertragungen()
      if (lobjUebertragungen === null) {

      } else {
        lobjUebertragungen.forEach(lobjEintrag => {
          larrAuswahl.push({ label: lobjEintrag.snippet.title, value: lobjEintrag.id })
        })
        this.$q.dialog({
          title: 'YouTube',
          message: 'Bitte die YouTube-Übertragung auswählen:',
          options: {
            type: 'radio',
            model: 'opt1',
            // inline: true
            items: larrAuswahl
          },
          cancel: true,
          persistent: true
        }).onOk(lstrID => {
          this.$store.commit('app/setze', { YouTubeID: lstrID })
        }).onCancel(() => {
          this.$store.commit('app/setze', { YouTubeID: 'Keine' })
        })
      }
    },
    GitHub () {
      if (this.$store.state.app.GitHub === null) {
        const lstrBenutzerverzeichnis = require('os').homedir()
        if (!gmodDS.existsSync(gmodPfad.join(lstrBenutzerverzeichnis, '.github'))) {
          this.$q.dialog({
            title: 'Aktualisierungen',
            message: 'Die Aktualisierungen sind nicht aktiviert. Du brauchst dafür einen Zugangscode. Soll dieses jetzt gemacht werden?',
            prompt: {
              model: '',
              type: 'text' // optional
            },
            cancel: true,
            persistent: true
          }).onOk((GitHubToken) => {
            gmodDS.writeFileSync(gmodPfad.join(lstrBenutzerverzeichnis, '.github'), GitHubToken, 'utf-8')
            this.$store.commit('app/setze', { GitHub: GitHubToken })
          })
        } else {
          this.$store.commit('app/setze', { GitHub: gmodDS.readFileSync(gmodPfad.join(lstrBenutzerverzeichnis, '.github'), 'utf-8') })
        }
      }
    },
    async neue_Version () {
      if (this.$store.state.app.GitHub !== null) {
        const { Octokit } = require('@octokit/rest')

        const octokit = new Octokit({
          auth: this.$store.state.app.GitHub
        })

        const lobjGitHubDaten = await octokit.repos.getLatestRelease({
          owner: 'hhsued',
          repo: 'Uebertragung'
        })
        if (this.$store.state.app.Version !== lobjGitHubDaten.data.tag_name) {
          this.$q.dialog({
            title: 'Neue Version verfügbar',
            message: 'Deine Version: ' + this.$store.state.app.Version + ', neue Version: ' + lobjGitHubDaten.data.tag_name,
            cancel: true,
            persistent: true
          }).onOk(() => {
            this.$q.notify('Das Herunterladen hat im Hintergrund begonnen. Nach dem Abschluss kommt eine Nachricht hoch!')
            this.neueVersion_laden(lobjGitHubDaten.data.assets[0].browser_download_url, gmodPfad.join(process.cwd(), lobjGitHubDaten.data.tag_name + '.zip'))
          })
        } else {
          this.$q.notify('Keine neue Version gefunden!')
        }
      }
    },
    neueVersion_laden (Adresse, Ziel, Version) {
      const lmodAnfrage = require('request')
      const ldaDatei = gmodDS.createWriteStream(Ziel)
      const lmixSendeAnfrage = lmodAnfrage.get(Adresse)

      // verify response code
      lmixSendeAnfrage.on('response', (response) => {
        if (response.statusCode !== 200) {
          this.$q.notify('Fehler beim Herunterladen: ' + response.statusCode)
        }

        lmixSendeAnfrage.pipe(ldaDatei)
      })
      ldaDatei.on('finish', () => {
        ldaDatei.close()
        this.$q.dialog({
          title: 'Neue Version heruntergeladen',
          message: 'Du musst dieses Programm beenden und die ZIP-Datei im Verzeichnis "' + process.cwd() + '" entpacken. Programm jetzt beenden?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.on_Ende()
        })
      })
      lmixSendeAnfrage.on('error', (err) => {
        gmodDS.unlink(Ziel)
        this.$q.notify('Fehler beim Herunterladen: ' + err.message)
      })

      ldaDatei.on('error', (err) => { // Handle errors
        gmodDS.unlink(Ziel)
        this.$q.notify('Fehler beim Herunterladen: ' + err.message)
      })
    },
    erneute_Pruefung () {
      const remote = require('electron').remote
      const lobjFenster = remote.getCurrentWindow()
      lobjFenster.reload()
    },
    on_Ende () {
      const remote = require('electron').remote
      const lobjFenster = remote.getCurrentWindow()
      lobjFenster.close()
    },
    async initieren () {
      // Prüfe auf OBS-Installation
      /* if (!this.OBS_installiert()) {
        this.aktive_Komponente = 'keinOBSGefunden'
        return
      }
      if (!this.$E.pruefe_auf_Datenverzeichnis()) {
        this.aktive_Komponente = 'Einrichtung'
        return
      } */
      if (!await this.$OBS.gestartet()) {
        this.KeinOBSAktiv = true
      }
      this.aktive_Komponente = 'Live'
      this.Quellen_und_Szenen()
    },
    on_Eintrag (Welcher) {
      if (Welcher !== 'Neu') {
        this.aktive_Komponente = Welcher
      } else {
        this.DialogNeues = true
      }
    },
    async Quellen_und_Szenen () {
      await this.$OBS.Quellen_laden()
      await this.$OBS.Szenen_laden()
    },
    OBS_installiert () {
      switch (gmodBS.platform()) {
        case 'darwin':
          return gmodDS.existsSync('~/Library/Application Support/obs-studio')
        case 'linux':
          return gmodDS.existsSync('~/.config/obs-studio')
        case 'win32':
          return gmodDS.existsSync(gmodPfad.join(gmodBS.homedir(), 'AppData', 'Roaming', 'obs-studio'))
      }
      // Windows: C:\Users\ckoeste1\AppData\Roaming\obs-studio
      // OSX: ~/Library/Application Support/obs-studio
      // Linux: ~/.config/obs-studio
    },
    onTT (obs, Szene, Text) {
      obs.send('SetTextGDIPlusProperties', {
        source: 'T_Name',
        text: 'Juhu'
      })
    },
    on_Test () {
      const OBSWebSocket = require('obs-websocket-js')
      const obs = new OBSWebSocket()
      obs.connect({
        address: 'localhost:4444',
        password: 'Nak123!HHS'
      }).then(() => {
        return obs.send('GetTransitionList')
      }).then(data => {
        obs.send('SetTransitionDuration', { duration: 3000 })
      })
    }
  }
}
</script>
