import lmodOBS from './OBS'
import lmodE from './Einstellungen'
import { Notify } from 'quasar'
export default {
  Stellen (Wert, Länge) {
    let lstrWert = ''
    Wert = Wert.toString()
    if (Wert.length < Länge) {
      for (let lintZaehler = Wert.length; lintZaehler < Länge; lintZaehler++) {
        lstrWert += '0'
      }
      lstrWert += Wert
    } else {
      lstrWert = Wert
    }
    return lstrWert
  },
  loeschen (Daten) {
    Object.keys(Daten).forEach(lstrSchluessel => {
      switch (typeof (Daten[lstrSchluessel])) {
        case 'object':
          Daten[lstrSchluessel] = {}
          break
        case 'boolean':
          Daten[lstrSchluessel] = false
          break
        case 'number':
          Daten[lstrSchluessel] = 0
          break
        case 'string':
          Daten[lstrSchluessel] = ''
          break
      }
    })
    Notify.create('Daten gelöscht')
    // return Daten
  },
  speichern (Name, Daten) {
    const lstrSpeichern = {}
    Object.keys(Daten).forEach(lstrSchluessel => {
      if (Daten.nicht_speichern === undefined || !Daten.nicht_speichern.includes(lstrSchluessel)) {
        lstrSpeichern[lstrSchluessel] = Daten[lstrSchluessel]
      }
    })
    lmodE.Sitzung_speichern(Name, lstrSpeichern)
    Notify.create('Daten gespeichert')
  },
  laden (Name, GlobalerSpeicher, Daten, Datenspeicher) {
    const lobjDaten = lmodE.Sitzung_laden(Name)
    Object.keys(lobjDaten).forEach(lstrSchluessel => {
      Datenspeicher.commit(GlobalerSpeicher + '/setze', { [lstrSchluessel]: lobjDaten[lstrSchluessel] })
      Daten[lstrSchluessel] = lobjDaten[lstrSchluessel]
    })
    Notify.create('Daten geladen')
  },
  async Aktionen (Aktion, Szene, Komponente, Standardperspektive, Programmspeicher, Ansichtskonfiguration, AbweichendePerspektive = null) {
    if (Standardperspektive) {
      this.Standardperspektive(Komponente, Programmspeicher, AbweichendePerspektive)
    }
    this.Ansicht_aufbauen(Ansichtskonfiguration)
    this.Kamera_Mikros(Programmspeicher, Szene)
    switch (Aktion) {
      case 'Live':
        await lmodOBS.Szene('Vorschau', Szene)
        await lmodOBS.Szene('Live', Szene, 1000)
        break
      case 'Vorschau':
        await lmodOBS.Szene('Vorschau', Szene)
        break
    }
  },
  Ansicht_aufbauen (Ansichtskonfiguration) {
    Ansichtskonfiguration.forEach(lobjElement => {
      switch (lobjElement.Typ) {
        case 'Text_Hintergrund':
          this.Ansicht_TextHintergrund(lobjElement)
          break
        case 'Text':
          this.Ansicht_Text(lobjElement)
          break
      }
    })
  },
  async Ansicht_Text (Daten) {
    await lmodOBS.Text(
      Daten.Quelle,
      Daten.Text,
      Daten.Schriftgröße,
      Daten.Schriftart,
      Daten.Kontur,
      Daten.Konturfarbe,
      Daten.Konturgröße = 5)
    if (Daten.Szene !== undefined) {
      await lmodOBS.Sichtbarkeit(Daten.Szene, Daten.Quelle, true)
    }
  },
  async Ansicht_TextHintergrund (Daten) {
    await lmodOBS.Text_und_Hintergrund(
      {
        Quelle: Daten.Textquelle,
        Szene: Daten.Szene,
        Text: Daten.Text,
        Schriftart: Daten.Schriftart,
        Schriftgröße: Daten.Schriftgröße,
        Unten: Daten.Unten,
        Oben: Daten.Oben,
        Links: Daten.Links
      },
      {
        Quelle: Daten.Hintergrundquelle,
        Szene: Daten.Szene
      }
    )
    if (Daten.Szene !== undefined) {
      await lmodOBS.Sichtbarkeit(Daten.Szene, Daten.Textquelle, true)
      await lmodOBS.Sichtbarkeit(Daten.Szene, Daten.Hintergrundquelle, true)
    }
  },

  Kamera_Mikros (Programmspeicher, Szene) {
    this.Pruefung(Programmspeicher.state.app.Mikrofone, Szene)
    Programmspeicher.commit('app/Mikrofon_live')
    this.Pruefung(Programmspeicher.state.app.Kameras, Szene)
    Programmspeicher.commit('app/Kamera_live')
  },
  async Standardperspektive (Komponente, Programmspeicher, AbweichendePerspektive = null) {
    let lobjStandardperspektive = null
    if (AbweichendePerspektive !== null) {
      lobjStandardperspektive = lmodE.Daten_laden(Komponente, 'Perspektiven', AbweichendePerspektive)
    } else {
      lobjStandardperspektive = lmodE.Daten_laden(Komponente, 'Perspektiven', 'Standard')
    }

    Programmspeicher.commit('app/Kamera_ändern', { Kamera: lobjStandardperspektive.aktiv.Kamera })
    Programmspeicher.commit('app/Mikrofone_ändern', { Mikrofone: lobjStandardperspektive.aktiv.Mikros })
    lobjStandardperspektive.aktiv.Quellen.forEach(async lstrQuelle => {
      await lmodOBS.Sichtbarkeit(lobjStandardperspektive.Szene, lstrQuelle, true)
    })
    lobjStandardperspektive.inaktiv.Quellen.forEach(async lstrQuelle => {
      await lmodOBS.Sichtbarkeit(lobjStandardperspektive.Szene, lstrQuelle, false)
    })
  },
  async Pruefung (Objekte, Szene) {
    Objekte.forEach(async (lobjObjekt, lintIndex) => {
      const lobjElementDaten = await lmodOBS.Informationen('GetSceneItemProperties', lobjObjekt.Quelle, Szene)
      // Das Objekt ist unsichtbar, soll aber sichtbar sein
      if (!lobjElementDaten.visible && Objekte[lintIndex].Hintergrund === 'primary') {
        await lmodOBS.Sichtbarkeit(
          Szene,
          lobjObjekt.Quelle,
          true
        )
      }
      // Das Objekt ist sichtbar, soll aber unsichtbar sein
      if (lobjElementDaten.visible && Objekte[lintIndex].Hintergrund === 'white') {
        await lmodOBS.Sichtbarkeit(
          Szene,
          lobjObjekt.Quelle,
          false
        )
      }
      // Das Mikro ist unsichtbar, soll aber eingeschaltet werden
      if (!lobjElementDaten.visible && Objekte[lintIndex].Hintergrund === 'warning') {
        await lmodOBS.Sichtbarkeit(
          Szene,
          lobjObjekt.Quelle,
          true
        )
      }
    })
  }
}
