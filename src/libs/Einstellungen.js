/* eslint-disable space-before-function-paren */
const gmodPath = require('path')
const gmodFS = require('fs')
const lobjKomponentenPfad = gmodPath.join(process.cwd(), 'Daten', 'Einstellungen', 'Komponenten')
const lobjPfad = gmodPath.join(process.cwd(), 'Daten', 'Einstellungen')
const lobjSitzungspfad = gmodPath.join(process.cwd(), 'Daten', 'Sitzungen')
export default {
  pruefe_auf_Datenverzeichnis() {
    if (!gmodFS.existsSync(gmodPath.join(process.cwd(),
      'Daten'))) {
      return false
    }
    return true
  },
  Daten_laden(Komponente, Datenname, Name = null) {
    const lobjDaten = JSON.parse(
      gmodFS.readFileSync(
        gmodPath.join(lobjKomponentenPfad, Komponente, Datenname + '.json'),
        'utf-8')
    )
    if (Name !== null) {
      return lobjDaten[Name]
    }
    return lobjDaten
  },
  Daten_speichern(Komponente, Datenname, Daten, Name = null) {
    const lobjDaten = this.Daten_laden(Komponente, Datenname)
    if (Name !== null) {
      lobjDaten[Name] = Name
    }
    gmodFS.writeFileSync(
      gmodPath.join(lobjKomponentenPfad, Komponente, Datenname + '.json'),
      JSON.stringify(Daten),
      'utf-8')
  },
  laden(Konfiguration, Pfad = null) {
    try {
      if (Pfad === null) {
        return JSON.parse(gmodFS.readFileSync(gmodPath.join(lobjPfad, Konfiguration.toLowerCase() + '.json'), 'utf-8'))
      } else {
        return JSON.parse(gmodFS.readFileSync(gmodPath.join(Pfad, Konfiguration + '.json'), 'utf-8'))
      }
    } catch (lobjError) {
      console.log('Konnte die folgende Konfiguration nicht laden: ' + Konfiguration)
      return null
    }
  },
  speichern(Konfiguration, Daten, Pfad = null) {
    if (Pfad === null) {
      gmodFS.writeFileSync(gmodPath.join(lobjPfad, Konfiguration.toLowerCase() + '.json'), JSON.stringify(Daten), 'utf-8')
    } else {
      gmodFS.writeFileSync(gmodPath.join(Pfad, Konfiguration + '.json'), JSON.stringify(Daten), 'utf-8')
    }
  },
  Sitzung_speichern(Modul, Daten, Sitzungsname = 'Standard') {
    gmodFS.writeFileSync(gmodPath.join(lobjSitzungspfad, Sitzungsname, Modul + '.json'), JSON.stringify(Daten), 'utf-8')
  },
  Sitzung_laden(Modul, Sitzungsname = 'Standard') {
    return JSON.parse(gmodFS.readFileSync(gmodPath.join(lobjSitzungspfad, Sitzungsname, Modul + '.json'), 'utf-8'))
  }
}
