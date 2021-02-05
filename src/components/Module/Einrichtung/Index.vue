
 <template lang="pug">
div
  q-stepper(v-model="Schritt", vertical, color="primary", animated)
    q-step(:name="1", title="Willkommen", icon="settings")
      | So wie es aussieht, startest Du das Programm zum ersten Mal.
      | Ich konnte nämlich keine Einstellungen und keine Daten finden
      q-stepper-navigation
        q-btn(@click="Schritt = 2", color="primary", label="Weiter", dense)
    q-step(
      :name="2",
      title="OBS",
      caption="Erweiterung WebSockets",
      icon="settings"
    )
      div(v-if="!Konfig.WebSockets.installiert")
        div Die benötigte Erweiterung 'WebSockets' ist nicht in OBS installiert. Lade diese bitte herunter, installiere sie und starte OBS
        div Starte dann dieses Programm neu
        q-btn(
          label="Programm beenden",
          color="primary",
          unelevated,
          @click="on_Beenden",
          dense
        )
      div(v-if="Konfig.WebSockets.installiert")
        div Habe die benötigte Erweiterung 'WebSockets' gefunden. Wir können weiter machen!
        q-stepper-navigation
          q-btn(@click="Schritt = 3", color="primary", label="Weiter", dense)
    q-step(:name="3", title="OBS", caption="Profil", icon="settings")
      div(v-if="!Weiter")
        div Ich lege ein neues Profil mit den für die Übertragung passenden Daten an
        div(v-if="!Konfig.WebSockets.Server_aktiviert")
          div Dein WebSocket-Server ist in den bisherigen Einstellungen nicht aktiviert. Im neuen Profil werde ich ihn aktivieren
        div WebSocket-Port: {{ Konfig.WebSockets.Server_Port }}
        div(v-if="Konfig.WebSockets.Fehlersuche")
          div Du hattest die Fehlersuche aktiviert, im neuen Profil wird sie deaktiviert werden
        div(v-if="Konfig.WebSockets.Benachrichtigungen")
          div Die Benachrichtigungen waren aktiv, werde sie im neuen Profil deaktivieren
        div(v-if="Konfig.WebSockets.Passwort_nötig")
          div Es wurde ein Passwort verlangt. Deaktiviere dieses im neuen Profil
        div
          b Hinweis:&nbsp;
          div Alle Einstellungen des neuen Profils können direkt über OBS geändert werden.
          div Wird der Port geändert oder wird ein Passwort gesetzt, so kann man dieses in den Einstellungen dieses Programms später noch einstellen können
        br
        br
        q-input(
          v-model="Konfig.Profil.Name",
          label="Name des neuen Profils",
          hint="Bitte keine Leerzeichen und Sonderzeichen nutzen. Sollten Leerzeichen vorhanden sein, werden diese entfernt, ebenso Sonderzeichen"
        )
        q-btn(
          label="Neues Profil anlegen",
          @click="on_Neues_Profil",
          v-if="Konfig.Profil.Name.length > 2",
          dense
        )
      div(v-if="Weiter")
        div Das neue Profil wurde erfolgreich angelegt
        q-stepper-navigation
          q-btn(@click="Schritt = 4", color="primary", label="Weiter", dense)
  //-q-stepper(
    v-model="Schritt"
    vertical
    color="primary"
    animated)
    q-step(
      :name="1"
      title="Willkommen"
      icon="settings"
      :done="Schritt > 1")
      | So wie es aussieht, startest Du das Programm zum ersten Mal.
      | Ich konnte nämlich keine Einstellungen und keine Daten finden
      q-stepper-navigation
        q-btn(@click="Schritt = 2" color="primary" label="Weiter")
    q-step(
      :name="2"
      title="OBS"
      caption="Programm und Erweiterung"
      icon="create_new_folder"
      :done="Schritt > 2")
      div Dieses Programm kann nur funktionieren, wenn ein eingerichtetes und laufendes OBS (Open Broadcaster Software) installiert und mit der Erweiterung Web-Socket versehen ist.
      div OBS bekommt man hier:&nbsp;
        a(href="https://obsproject.com/") https://obsproject.com/
      div Ebenso muss die Erweiterung OBS WebSocket installiert sein. Diese ist hier zu bekommen:&nbsp;
        a(href="https://github.com/Palakis/obs-websocket/releases/tag/4.8.0") https://github.com/Palakis/obs-websocket/releases/tag/4.8.0
      q-checkbox(label="Ich habe OBS installiert", v-model="OBS")
      br
      q-checkbox(label="Ich habe OBS WebSocket installiert", v-model="WebSocket")
      q-stepper-navigation
        q-btn(@click="Schritt = 3" color="primary" label="Weiter", v-if="OBS && WebSocket")
    q-step(
      :name="3"
      title="OBS"
      caption="Verbindung vorbereiten"
      icon="assignment")
      | Bitte wie unten beschrieben vorgehen
      ol
        li OBS starten
        li Öffnen des Menüeintrags "Werkzeuge" in der Menüleiste am oberen Rand des Programms
        li Auswählen des Eintrags "WebSockets-Servereinstellungen"
        li Folgende Einstellungen werden vorgeschlagen
          ul
            li WebSockets-Server aktivieren (Haken setzen)
            li Server-Port: 4444
            li Authentifizierung aktivieren (Haken setzen)
            li Passwort: frei wählbar
            li Infobereichbenachrichtungen aktivieren (KEINEN Haken setzen)
            li Debug-Protokollierung aktivieren (KEINEN Haken setzen)
            li Mit Okay bestätigen
      q-stepper-navigation
        q-btn(@click="Schritt = 4" color="primary" label="Weiter")
    q-step(
      :name="4"
      title="OBS"
      caption="Verbindung herstellen"
      icon="add_comment")
      q-input(label="Server-Host", v-model="Server.Host", hint="Wenn sich OBS auf einem anderen Rechner im Netzwerk befindet, so ist hier die IP-Adresse oder der Name des Rechners einzutragen. Befindet sich OBS auf diesem Rechner, so muss hier weiterhin 'localhost' stehen bleiben")
      q-input(label="Server-Port", v-model="Server.Port")
      q-input(label="Server-Passwort", v-model="Server.Passwort", hint="Bitte nur ausfüllen, wenn im OBS in der Erweiterung Web-Socket ein Passwort gesetzt wurde")

      div(v-if="!Server.Verbunden")
        br
        | ACHTUNG: Bevor die Verbindung getestet wird, ist sicherzustellen, dass OBS ausgeführt wird!
        br
        q-checkbox(label="Ich habe OBS gestartet", v-model="Server.OBS_gestartet")
        br
        q-btn(label="Verbindung testen", color="primary", unelevated, v-if="Server.OBS_gestartet", @click="on_Verbindungstest")
      div(v-if="Server.Verbunden")
        .text-h6 Die Verbindung konnte erfolgreich aufgebaut werden
      q-stepper-navigation
        q-btn(@click="Schritt = 5" color="primary" label="Weiter", v-if="Server.Verbunden")
    q-step(
      :name="5"
      title="Einrichtung"
      caption="Basis"
      icon="add_comment")
      div(v-if="Einrichtung.Typ === 'ganz neu'")
        | Es sieht so aus, als ob es in Deinem OBS noch keine Daten gibt. Wir richten das OBS nun gemeinsam ein
      div(v-if="Einrichtung.Typ === 'leere Szenensammlung'")
        div Du hast im Deinem OBS aktuell die Szenensammlung&nbsp;
          b {{Einrichtung.aktive_Szenensammlung}}&nbsp;
          | ausgewählt
        div Diese Szenensammlung ist leer
      div(v-if="Einrichtung.Typ === 'benutzte Szenensammlung'")
        div Du hast im Deinem OBS aktuell die Szenensammlung&nbsp;
          b {{Einrichtung.aktive_Szenensammlung}}&nbsp;
          | ausgewählt
        div Diese Szenensammlung ist NICHT leer
        div Möchtest Du diese Szenensammlung nutzen oder eine neue, leere Szenensammlung anlegen?
        q-btn(label="Szenensammlung nutzen",@click="on_Einrichtungstyp('nutzen')")
        q-btn(label="Neue, leere Szenensammlung anlegen",@click="on_Einrichtungstyp('neu')")
      div(v-if="Einrichtung.Typ === 'neu anlegen'")
        | Die folgenden Schritte müssen im OBS durchgeführt werden, da es dafür noch keine Möglichkeit in diesem Programm gibt
        ol
          li Öffne in der Menüleiste den Menüpunkt "Szenensammlung"
          li Klicke den Eintrag "Neu" an
          li Gibt, im neuen Fenster, einen aussagekräftigen Namen für die neue Szenensammlung ein
          li Klicke auf "Okay"
      div(v-if="Einrichtung.Weiter")
        div Alles klar, Du hast eine neue Szenensammlung mit dem Namen&nbsp;
          b {{Einrichtung.aktive_Szenensammlung}}&nbsp;
          | angelegt. Nun kann es weiter zum nächsten Schritt gehen
      //-div(v-if="Einrichtung.Typ === 'Bestehende Szenensammlung'")
          | Oha, na dann lass es uns einmal versuchen
      q-stepper-navigation
        q-btn(@click="Schritt = 6", color="primary", label="Leere Szenensammlung einrichten", v-if="Einrichtung.Typ === 'leere Szenensammlung'")
        q-btn(@click="Schritt = 6" color="primary" label="Weiter", v-if="Einrichtung.Weiter")
    q-step(
      :name="6"
      title="Einrichtung"
      caption="Szenen"
      icon="add_comment")
        div Jetzt werden die benötigten Szenen mit den Quellen eingerichtet
        q-input(label="Wie viele Kameras hast du?", type="number", v-model="Einrichtung.Kameras")
        q-input(label="Wie viele Mikrofone hast du (ggf. auch in Kameras integrierte Mikrofone)?", type="number", v-model="Einrichtung.Mikrofone", v-if="Einrichtung.Kameras > 0")
        br
        q-btn(label="Einrichtung beginnen", @click="on_Einrichtung_beginnen", v-if="Einrichtung.Kameras > 0 && Einrichtung.Mikrofone > 0", color="primary")
</template>
<script>
/* eslint-disable no-unused-vars */
const gmodDS = require('fs')
const gmodPfad = require('path')
const gmodBS = require('os')

export default {
  name: 'Einrichtung',
  components: {},
  data: () => ({
    Konfig: {
      OBS_Datenpfad: '',
      Szenensammlungen: 0,
      Profile: 0,
      WebSockets: {
        installiert: true,
        Server_aktiviert: false,
        Server_Port: 0,
        Fehlersuche: false,
        Benachrichtigungen: false,
        Passwort_nötig: false
      },
      Profil: {
        Name: ''
      }
    },
    Ini_Datei: '',
    Schritt: 1,
    Weiter: false
  }),
  watch: {
    Schritt (NeuerWert) {
      switch (NeuerWert) {
        case 2:
          this.Prüfe_auf_Websockets()
          break
      }
    }
  },
  mounted () {
    this.Konfig.OBS_Datenpfad = this.Datenpfad()
  },
  methods: {
    on_Beenden () {
      const remote = require('electron').remote
      const lobjFenster = remote.getCurrentWindow()
      lobjFenster.close()
    },
    reinige_Profilname () {
      return this.Konfig.Profil.Name.replace(' ', '_').replace('!', '').replace('?', '').replace('#', '')
    },
    Neues_Profil_Verzeichnis (Profilname) {
      const lstrPfad = gmodPfad.join(this.Konfig.OBS_Datenpfad, 'basic', 'profiles', Profilname)
      gmodDS.mkdirSync(lstrPfad)
      return lstrPfad
    },
    Neues_Profil_Ini_Datei (Pfad) {
      let lstrAusgabeText = ''
      const lobjProfilVorlage = JSON.parse(gmodDS.readFileSync(gmodPfad.join(process.cwd(), 'Vorlagen', 'Profil.json'), 'utf-8'))
      lobjProfilVorlage.General.Name = this.Konfig.Profil.Name
      Object.keys(lobjProfilVorlage).forEach(lstrKategorie => {
        lstrAusgabeText += '[' + lstrKategorie + ']\n'
        Object.keys(lobjProfilVorlage[lstrKategorie]).forEach(lstrEintrag => {
          if (lstrEintrag === 'AuthSecret' || lstrEintrag === 'AuthSalt') {
            lstrAusgabeText += lstrEintrag + '=' + lobjProfilVorlage[lstrKategorie][lstrEintrag] + '=\n'
          } else {
            lstrAusgabeText += lstrEintrag + '=' + lobjProfilVorlage[lstrKategorie][lstrEintrag] + '\n'
          }
        })
        lstrAusgabeText += '\n'
      })
      gmodDS.writeFileSync(gmodPfad.join(Pfad, 'basic.ini'), lstrAusgabeText, 'utf-8')
    },
    Neues_Profil_Service (Pfad) {
      gmodDS.writeFileSync(gmodPfad.join(Pfad, 'service.json'),
        JSON.stringify({
          settings: {
            bwtest: false,
            key: 'zatc-sau2-0kuj-xsuz-2dst',
            server: 'rtmp://a.rtmp.youtube.com/live2',
            service: 'YouTube - RTMP'
          },
          type: 'rtmp_common'
        }), 'utf-8')
      gmodDS.copyFileSync(gmodPfad.join(Pfad, 'service.json'), gmodPfad.join(Pfad, 'service.json.bak'))
    },
    Neues_Profil_StreamEncoder (Pfad) {
      gmodDS.writeFileSync(gmodPfad.join(Pfad, 'streamEncoder.json'),
        JSON.stringify({
          bitrate: 5000,
          preset: 'fast',
          profile: 'main'
        }), 'utf-8')
    },
    on_Neues_Profil () {
      const lstrPfad = this.Neues_Profil_Verzeichnis(this.reinige_Profilname())
      this.Neues_Profil_Ini_Datei(lstrPfad)
      this.Neues_Profil_Service(lstrPfad)
      this.Neues_Profil_StreamEncoder(lstrPfad)
      this.Weiter = true
    },
    Prüfe_auf_Websockets () {
      const lstrProfilPfad = gmodPfad.join(this.Konfig.OBS_Datenpfad, 'basic', 'profiles')
      const larrProfile = gmodDS.readdirSync(lstrProfilPfad)
      this.Ini_Datei = gmodDS.readFileSync(gmodPfad.join(lstrProfilPfad, larrProfile[0], 'basic.ini'), 'utf-8')
      if (this.Ini_Datei.indexOf('[WebsocketAPI]') === -1) {
        this.Konfig.WebSockets.installiert = false
      } else {
        this.Konfig.WebSockets.Server_aktiviert = this.Ini_Datei.indexOf('ServerEnabled=true') > 0
        this.Konfig.WebSockets.Fehlersuche = this.Ini_Datei.indexOf('DebugEnabled=true') > 0
        this.Konfig.WebSockets.Benachrichtigungen = this.Ini_Datei.indexOf('AlertsEnabled=true') > 0
        this.Konfig.WebSockets.Passwort_nötig = this.Ini_Datei.indexOf('AuthRequired=true') > 0
        this.Konfig.WebSockets.Server_Port = parseInt(this.Ini_Datei.match(/ServerPort=[0-9]{1,4}/)[0].split('=')[1])
      }
    },
    Datenpfad () {
      switch (gmodBS.platform()) {
        case 'darwin':
          return '~/Library/Application Support/obs-studio'
        case 'linux':
          return '~/.config/obs-studio'
        case 'win32':
          return gmodPfad.join(gmodBS.homedir(), 'AppData', 'Roaming', 'obs-studio')
      }
    },
    // --------------------------------------------------------------------------------------------------------------------
    on_Einrichtung_beginnen () {
      // S_Kameras
      // ++++++++++++++++++++++++++++++
      // Kameras
      // Mikrofone
      // ------------------------------
      // S_Personen
      // ++++++++++++++++++++++++++++++
      // T_Zusatz
      // T_Name
      // FQ_Bauchbinde
      // Kameras
      // Mikrofone
      // ------------------------------
      // S_Lied
      // ++++++++++++++++++++++++++++++
      // T_Lied-Nr
      // T_Lied-Titel
      // FQ_Bauchbinde
      // Kameras
      // Mikros
      // ------------------------------
      // S_Strophe
      // ++++++++++++++++++++++++++++++
      // T_Lied-Nr
      // T_Lied-Titel
      // FQ_Bauchbinde
      // T_Strophe
      // FQ_Hintergrund
      // G_Abendmahl
      // Kameras
      // Mikros
      // ------------------------------
      // S_Textwort
      // ++++++++++++++++++++++++++++++
      // T_Textwort-Ort
      // T_Textwort-Verse
      // FQ_Bauchbinde
      // FQ_Hintergrund
      // Kameras
      // Mikros
      // ------------------------------
      // S_Einspieler
      // ++++++++++++++++++++++++++++++
      // T_Beschreibung-Text
      // FQ_Beschreibung-Hintergrund
      // G_Bild-Einspieler
      // V_Einspieler
      // A_Wartemusik
      // ------------------------------
      // S_Warten
      // ++++++++++++++++++++++++++++++
      // T_Übertragunsstart
      // T_Starthinweis
      // T_Beginn
      // T_Datum
      // T_Gottesdienstart
      // A_Wartemusik
      // V_Warten
      // G_Warten
      // ------------------------------
      // S_Ende
      // ++++++++++++++++++++++++++++++
      // T_Weitere-Hinweise
      // T_Übertragung-beendet
      // G_Hintergrundbild
      // ------------------------------
      // S_Schwarz
      // ++++++++++++++++++++++++++++++
      // FQ_Hintergrund-schwarz
      // ------------------------------
      // S_Start_Übertragung
      // ++++++++++++++++++++++++++++++
      // V_Anfang
      // G_Anfang
      // A_Wartemusik
      // ------------------------------
      // S_Hinweis
      // ++++++++++++++++++++++++++++++
      // T_Hinweis
      // FQ_Hintergrund
      // Mikros
      // Kameras
      // ------------------------------
      // S_Sondereinblendung
      // ++++++++++++++++++++++++++++++
      // T_Sondereinblendung
      // G_Sondereinblendung
    },
    async hole_aktive_Szenensammlung () {
      const lobjSammlung = await this.$OBS.Szene('Aktuelle Sammlung')
      this.Einrichtung.aktive_Szenensammlung = lobjSammlung.scName
      this.Einrichtung.Weiter = true
    },
    Überwache_Verbindung () {
      if (!this.Einrichtung.Weiter) {
        const lobjOBS = this.$OBS.Verbindung()
        lobjOBS.on('SceneCollectionListChanged', async Daten => {
          this.hole_aktive_Szenensammlung()
        })
      }
    },
    on_Einrichtungstyp (Typ) {
      switch (Typ) {
        case 'neu':
          this.Einrichtung.Typ = 'neu anlegen'
          this.Überwache_Verbindung()
          break
        case 'nutzen':
          break
      }
    },
    async on_Neue_Szenensammlung_angelegt () {
      const lobjNeueSzenensammlungen = await this.$OBS.Szene('Sammlungen')
      const larrNeueSzenensammlungen = []
      const larrAlteSzenensammlungen = []
      let lstrNeueSammlung = ''
      lobjNeueSzenensammlungen.sceneCollections.forEach(lobjSammlung => {
        larrNeueSzenensammlungen.push(lobjSammlung['sc-name'])
      })
      this.Szenensammlungen.sceneCollections.forEach(lobjSammlung => {
        larrAlteSzenensammlungen.push(lobjSammlung['sc-name'])
      })
      larrNeueSzenensammlungen.forEach((lstrSammlung, lintIndex) => {
        if (larrAlteSzenensammlungen.indexOf(lstrSammlung) === -1) {
          lstrNeueSammlung = lstrSammlung
          this.$OBS.Szene('Setze Sammlung', lstrNeueSammlung)
          this.Weiter = true
        }
      })
      this.neue_Sammlung = lstrNeueSammlung
    },
    async on_Verbindungstest () {
      const lboolVerbunden = await this.$OBS.pruefe_Verbindung(this.Server.Host, this.Server.Port, this.Server.Passwort)
      if (lboolVerbunden) {
        this.Server.Verbunden = true
        // gmodDS.mkdirSync(gmodPfad.join(process.cwd(), 'Daten'))
        // gmodDS.mkdirSync(gmodPfad.join(process.cwd(), 'Daten', 'Einstellungen'))
        /* gmodDS.writeFileSync(gmodPfad.join(process.cwd(), 'Daten', 'Einstellungen', 'OBS.json'), JSON.stringify({
          Verbindung: {
            Server: this.Server.Host,
            Port: this.Server.Port,
            Passwort: this.Server.Passwort
          },
          Vorgaben: {
            Strophen: {
              Zeilenhoehe: 61,
              Schriftart: 'arial',
              Schriftgroesse: 60,
              Schriftfarbe: 'schwarz',
              links: 40,
              oben: 10,
              unten: 10
            },
            Lieder: {}
          },
          Autostart: {
            Typ: 'jeden',
            Tag: 'Sonntag',
            um: '9:15'
          }
        })) */
        this.Quellen = await this.$OBS.Quelle('Quellen')
        this.Szenensammlungen = await this.$OBS.Szene('Sammlungen')
        this.Szenen = await this.$OBS.Szene('Szenen')
        const lobjSammlung = await this.$OBS.Szene('Aktuelle Sammlung')
        this.Einrichtung.aktive_Szenensammlung = lobjSammlung.scName
        /*
          Quellen: 0
          Szenensammlungen: 1
          Szenen: 1
          = Ganz neu
        */
        if (this.Quellen.sources.length === 0 && this.Szenensammlungen.sceneCollections.length === 1 && this.Szenen.scenes.length === 1) {
          this.Einrichtung.Typ = 'ganz neu'
        }
        /*
          Quellen: 0
          Szenensammlungen: > 1
          Szenen: 1
          = In neuer Szenensammlung
        */
        if (this.Quellen.sources.length === 0 && this.Szenensammlungen.sceneCollections.length > 1 && this.Szenen.scenes.length === 1) {
          this.Einrichtung.Typ = 'leere Szenensammlung'
        }
        /*
          Quellen: > 0
          Szenensammlungen: 1
          Szenen: > 1
          = Eine benutzte Szenensammlung
        */
        if (this.Quellen.sources.length > 0 && this.Szenensammlungen.sceneCollections.length === 1 && this.Szenen.scenes.length > 1) {
          this.Einrichtung.Typ = 'benutzte Szenensammlung'
        }
        /*
          Quellen: > 0
          Szenensammlungen: > 1
          Szenen: > 1
          = Eine benutzte Szenensammlung
        */
        if (this.Quellen.sources.length > 0 && this.Szenensammlungen.sceneCollections.length > 1 && this.Szenen.scenes.length > 1) {
          this.Einrichtung.Typ = 'benutzte Szenensammlung'
        }
      }
    }
  }
}
</script>
