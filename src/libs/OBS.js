/* eslint-disable camelcase */
const LmodOBSWebSocket = require('obs-websocket-js')
const gobjOBS = new LmodOBSWebSocket()
const gmodDS = require('fs')
const gmodPfad = require('path')
import lmodE from './Einstellungen'

const gobjProgramm = lmodE.laden('obs')
let gobsIstVerbunden = false
let garrSzenen = []
let gobjquellen = {}

// eslint-disable-next-line no-unused-vars
/* const Farben = {
  Schwarz: '4278190080'
} */
export default {
  Verbindung () {
    return gobjOBS
  },
  async pruefe_Verbindung (Server = null, Port = null, Passwort = null) {
    if (gobjProgramm !== null && Server === null) {
      Server = gobjProgramm.Verbindung.Server
      Port = gobjProgramm.Verbindung.Port
      Passwort = gobjProgramm.Verbindung.Passwort
    }
    if (Server !== null && Port !== null && Passwort !== null) {
      if (!gobsIstVerbunden) {
        try {
          await gobjOBS.connect({
            address: Server + ':' + Port,
            password: Passwort
          })
        } catch (lobjError) {
          if (lobjError.code === 'CONNECTION_ERROR') {
            gobsIstVerbunden = false
            return
          }
        }
        gobsIstVerbunden = true
      }
    } else {
      gobsIstVerbunden = false
    }
    return gobsIstVerbunden
  },
  Vorgabe (Wovon, Welche) {
    return gobjProgramm.Vorgaben[Wovon][Welche]
  },
  async Informationen (Welche, Quelle, Szene) {
    const lobjDaten = await gobjOBS.send(Welche, {
      item: Quelle,
      'scene-name': Szene
    })
    return lobjDaten
  },
  async Information (Typ, Optionen) {
    let lobjDaten = null
    switch (Typ) {
      case 'Szene':
        if (typeof (Optionen) === 'string') {
          switch (Optionen) {
            case 'GetCurrentScene':
              // eslint-disable-next-line no-case-declarations
              const lobjInfo = await gobjOBS.send('GetCurrentScene', {})
              return lobjInfo
          }
        } else {
          const lobjInfo = await gobjOBS.send(Optionen.Anfrage, {
            sceneName: Optionen.Szene
          })
          return lobjInfo
        }
        break
      case 'Quelle':
        // GetSourcesList
        if (Optionen.Anfrage === 'GetSourcesList') {
          lobjDaten = await gobjOBS.send(Optionen.Anfrage, {})
        } else {
          lobjDaten = await gobjOBS.send(Optionen.Anfrage, {
            item: Optionen.Quelle,
            'scene-name': Optionen.Szene
          })
        }
        break
    }
    return lobjDaten
  },
  async Quelle (Aktion, Quelle = null, Szene = null, Daten = null) {
    switch (Aktion) {
      case 'Quellen':
        return await this.Information('Quelle', { Anfrage: 'GetSourcesList' })
      case 'Info':
        return await this.Informationen('GetSceneItemProperties', Quelle, Szene)
      case 'neu':
        break
      case 'Position':
        await gobjOBS.send('SetSceneItemProperties', {
          item: Quelle,
          'scene-name': Szene,
          position: {
            x: Daten.x,
            y: Daten.y
          }
        })
        break
      case 'Größe':
        if (Daten.Breite === null) {
          Daten.Breite = 1920
        }
        await gobjOBS.send('SetSceneItemProperties', {
          item: Quelle,
          'scene-name': Szene,
          bounds: {
            x: Daten.Breite,
            y: Daten.Höhe
          }
        })
        break
      case 'Position_Größe':
        await this.Quelle('Position', Quelle, Szene, { x: Daten.x, y: Daten.y })
        await this.Quelle('Größe', Quelle, Szene, { Breite: Daten.Breite, Höhe: Daten.Höhe })
        break
    }
  },
  async Szene (Aktion, Szenenname = null, Dauer = 1000) {
    switch (Aktion) {
      case 'Sammlungen':
        return await this.Information('Szene', { Anfrage: 'ListSceneCollections' })
      case 'Setze Sammlung':
        await gobjOBS.send('SetCurrentSceneCollection', {
          'sc-name': Szenenname
        })
        break
      case 'Aktuelle Sammlung':
        return await gobjOBS.send('GetCurrentSceneCollection')
      case 'Szenen':
        return await this.Information('Szene', { Anfrage: 'GetSceneList' })
      case 'neu':
        await gobjOBS.send('CreateScene', {
          sceneName: Szenenname
        })
        break
      case 'Quelle':

        break
      case 'Live':
        this.Überblendung('Dauer', Dauer)
        await gobjOBS.send('SetCurrentScene', {
          'scene-name': Szenenname
        })
        break
      case 'Vorschau':
        await gobjOBS.send('SetPreviewScene', {
          'scene-name': Szenenname
        })
        break
      case 'Aktuelle':
        return await this.Information('Szene', 'GetCurrentScene')
      // case 'Quellen':
      // return await this.Szene_Info('GetSceneItemList', Szenenname)
      case 'alle':
        return garrSzenen
    }
  },
  async Text (Quelle, Text, Schriftgroesse = 60, Schriftart = 'Arial', Kontur = false, Konturfarbe = 'Schwarz', Konturgroesse = 5) {
    await gobjOBS.send('SetTextGDIPlusProperties', {
      source: Quelle,
      text: Text,
      font: {
        face: Schriftart,
        size: Schriftgroesse
      },
      outline: Kontur,
      // outline_color: this.Farben[Konturfarbe],
      outline_size: Konturgroesse
    })
  },
  async Sichtbarkeit (Szene, Quelle, Sichtbar = true) {
    if (typeof (Quelle) === 'string') {
      await gobjOBS.send('SetSceneItemProperties', {
        'scene-name': Szene,
        item: Quelle,
        visible: Sichtbar
      })
    } else {
      Object.keys(Quelle).forEach(lstrQuelle => {
        this.Sichtbarkeit(Szene, Quelle[lstrQuelle], Sichtbar)
      })
    }
  },
  Überblendung (Aktion, Daten) {
    switch (Aktion) {
      case 'setzen':
        gobjOBS.send('SetCurrentTransition', {
          'transition-name': Daten
        })
        break
      case 'Dauer':
        gobjOBS.send('SetTransitionDuration', {
          duration: Daten
        })
        break
    }
  },
  async Text_und_Hintergrund (Text, Hintergrund) {
    if (Text.Schriftart === undefined) {
      Text.Schriftart = 'Arial'
    }
    if (Text.Schriftgröße === undefined) {
      Text.Schriftgröße = 60
    }
    if (Text.Kontur === undefined) {
      Text.Kontur = false
      Text.Konturgröße = 0
    }
    const lintTexthöhe = Text.Text.split('\n').length * Text.Schriftgröße
    await this.Text(
      Text.Quelle,
      Text.Text,
      Text.Schriftgröße,
      Text.Schriftart,
      Text.Kontur,
      '',
      Text.Konturgröße)
    await this.Quelle(
      'Position',
      Text.Quelle,
      Text.Szene,
      { x: Text.Links, y: (1080 - lintTexthöhe - Text.Unten) })
    await this.Quelle(
      'Position_Größe',
      Hintergrund.Quelle,
      Hintergrund.Szene,
      {
        Höhe: lintTexthöhe + Text.Unten + Text.Oben,
        Breite: 1920,
        x: 0,
        y: (1080 - lintTexthöhe - Text.Unten - Text.Oben)
      }
    )
  },
  async Perspektive (Szene, Aktive, Inaktive) {
    this.Sichtbarkeit(Szene, Aktive.Kamera, true)
    Aktive.Mikros.forEach(lstrMikro => {
      this.Sichtbarkeit(Szene, lstrMikro, true)
    })
    Aktive.Quellen.forEach(lstrQuelle => {
      this.Sichtbarkeit(Szene, lstrQuelle, true)
    })
    this.Sichtbarkeit(Szene, Inaktive.Kamera, false)
    Inaktive.Mikros.forEach(lstrMikro => {
      this.Sichtbarkeit(Szene, lstrMikro, false)
    })
    Inaktive.Quellen.forEach(lstrQuelle => {
      this.Sichtbarkeit(Szene, lstrQuelle, false)
    })
  },
  Anmeldedaten () {
    return gobjProgramm
  },
  async gestartet () {
    await this.pruefe_Verbindung()
    return gobsIstVerbunden
  },
  async Quellen_laden () {
    if (!gobsIstVerbunden) {
      gobjquellen = []
      const lobjDaten = JSON.parse(gmodDS.readFileSync(gmodPfad.join(gobjProgramm.Optionen, 'basic', 'scenes', gobjProgramm.Standardszenensammlung + '.json'), 'utf-8'))
      lobjDaten.sources.forEach(lobjQuelle => {
        gobjquellen.push(lobjQuelle.name)
      })
      return gobjquellen
    }
    if (gobjquellen.length === 0) {
      this.pruefe_Verbindung()
      const lobjData = await gobjOBS.send('GetSourcesList')
      gobjquellen = lobjData.sources
    }
  },
  async Szenen_laden () {
    if (!gobsIstVerbunden) {
      garrSzenen = []
      const lobjDaten = JSON.parse(gmodDS.readFileSync(gmodPfad.join(gobjProgramm.Optionen, 'basic', 'scenes', gobjProgramm.Standardszenensammlung + '.json'), 'utf-8'))
      lobjDaten.scene_order.forEach(lobjSzene => {
        garrSzenen.push(lobjSzene.name)
      })
    }
    if (garrSzenen.length === 0) {
      this.pruefe_Verbindung()
      const lobjData = await gobjOBS.send('GetSceneList')
      garrSzenen = lobjData.scenes
    }
  },
  Quellen (Filterparameter = '') {
    if (Filterparameter !== '') {
      return this.filtere_quellen(Filterparameter)
    } else {
      return gobjquellen
    }
  },
  filter_Dialog (vueInstanz) {
    vueInstanz.$q.dialog({
      title: 'Filtern',
      message: 'Bitte die zu filternden Einträge wählen:',
      options: {
        type: 'checkbox',
        model: [],
        // inline: true
        items: this.optionen.filter
      },
      cancel: true,
      persistent: true
    }).onOk(daten => {
      this.filtern(daten)
    })
  },
  filtere_Quellen (Filterparameter) {
    const larrWerte = []
    for (let lintZaehler = 0; lintZaehler < gobjquellen.length; lintZaehler++) {
      if (Filterparameter.length === 0) {
        larrWerte.push(gobjquellen[lintZaehler].name)
      } else {
        if (Filterparameter.includes(gobjquellen[lintZaehler].typeId)) {
          larrWerte.push(gobjquellen[lintZaehler].name)
        }
      }
    }
    return larrWerte
  },
  Stream (Was) {
    switch (Was) {
      case 'starten':
        gobjOBS.send('StartStreaming', {})
        break
      case 'beenden':
        gobjOBS.send('StopStreaming', {})
    }
  },
  MikroKamera (Aktive, Alle, Szene, Live) {
    if (typeof (Aktive) === 'string') {
      this.Sichtbarkeit(Szene, Aktive, true)
      Alle.forEach(lstrElement => {
        if (lstrElement !== Aktive) {
          this.Sichtbarkeit(Szene, lstrElement, false)
        }
      })
    } else {
      Aktive.forEach(lstrElement => {
        this.Sichtbarkeit(Szene, lstrElement, true)
      })
      Alle.forEach(lstrElement => {
        if (Aktive.indexOf(lstrElement) === -1) {
          this.Sichtbarkeit(Szene, lstrElement, false)
        }
      })
    }
    if (Live) {
      this.Szene_anzeigen(Szene)
    } else {
      this.Szene_Vorschau(Szene)
    }
  }
}
