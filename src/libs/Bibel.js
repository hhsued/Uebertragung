const lmodPfad = require('path')
const lmodDS = require('fs')
import lmodE from './Einstellungen'
const lobjBibelBuecher = lmodE.laden('Bibel', lmodPfad.join(process.cwd(),
  'Daten', 'Bibel'))
let lobjKapitel = []
export default {
  Buecher () {
    return Object.keys(lobjBibelBuecher)
  },
  Kapitel () {
    return lobjKapitel
  },
  anzahl_Kapitel_zu_Buch (Buch) {
    lobjKapitel = []
    return lobjBibelBuecher[Buch]
  },
  Datei_Kapitelinhalt (Buch, Kapitel) {
    return lmodPfad.join(
      process.cwd(),
      'Daten',
      'Bibel',
      'Bibelinhalt',
      Buch.replace(' ', '') + '_' + Kapitel.toString() + '.json')
  },
  lade_Kapitel (Buch, Kapitel) {
    lobjKapitel = JSON.parse(lmodDS.readFileSync(this.Datei_Kapitelinhalt(Buch, Kapitel)))
  },
  hole_Verse_anzahl (Buch, Kapitel) {
    if (lobjKapitel.length === 0) {
      this.lade_Kapitel(Buch, Kapitel)
    }
    return lobjKapitel.length
  },
  hole_Verse (Von, Bis = 0) {
    const larrText = []
    if (Bis === null || Bis === 0) {
      larrText.push(
        {
          Vers: parseInt(Object.keys(lobjKapitel[Von - 1])[0]),
          Text: lobjKapitel[Von - 1][Object.keys(lobjKapitel[Von - 1])[0]],
          Modus: 'Anzeige'
        })
    } else {
      for (let lintZaehler = (Von - 1); lintZaehler <= (Bis - 1); lintZaehler++) {
        larrText.push(
          {
            Vers: parseInt(Object.keys(lobjKapitel[lintZaehler])[0]),
            Text: lobjKapitel[lintZaehler][Object.keys(lobjKapitel[lintZaehler])[0]],
            Modus: 'Anzeige'
          })
      }
    }
    return larrText
  }

}
