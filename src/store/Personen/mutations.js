
const gmodPath = require('path')
const gmodFS = require('fs')
// import lmodE from '../../libs/Einstellungen'
const lstrDatenpfad = gmodPath.join(
  process.cwd(),
  'Daten', 'Personen', 'Personen.json'
)
export function laden (globaleDaten) {
  console.log(globaleDaten.Personen.length)
  globaleDaten.Datenpfad = lstrDatenpfad
  if (globaleDaten.Personen.length === 0) {
    const lobjPersonen = JSON.parse(gmodFS.readFileSync(lstrDatenpfad, 'utf-8'))
    lobjPersonen.forEach(lobjPerson => {
      globaleDaten.Personen.push(lobjPerson.Nachname + ', ' + lobjPerson.Vorname)
      if (!globaleDaten.Bereiche.includes(lobjPerson.Bereich)) {
        globaleDaten.Bereiche.push(lobjPerson.Bereich)
      }
    })
  }
  globaleDaten.Personen.sort()
}
export function filtern (globaleDaten, Filterwert) {
  globaleDaten.Personen = []
  const lobjPersonen = JSON.parse(gmodFS.readFileSync(lstrDatenpfad, 'utf-8'))
  lobjPersonen.forEach(lobjPerson => {
    if (Filterwert === 'ohne') {
      globaleDaten.Personen.push(lobjPerson.Nachname + ', ' + lobjPerson.Vorname)
    } else {
      if (lobjPerson.Bereich === Filterwert) {
        globaleDaten.Personen.push(lobjPerson.Nachname + ', ' + lobjPerson.Vorname)
      }
    }
  })
  globaleDaten.Personen.sort()
}
export function setze (globaleDaten, Optionen) {
  Object.keys(Optionen).forEach(lstrWert => {
    globaleDaten[lstrWert] = Optionen[lstrWert]
  })
}
export function BereichHinzu (globaleDaten, Bereich) {
  globaleDaten.Optionen.Bereiche.push(Bereich)
}
export function PersonLoeschen (globaleDaten, Person) {
  globaleDaten.Optionen.Personen.splice(globaleDaten.Optionen.Personen.indexOf(Person))
  gmodFS.writeFile(lstrDatenpfad, globaleDaten.Optionen.Personen, 'utf-8')
}
export function PersonHinzu (globaleDaten, Person) {
  globaleDaten.Optionen.Personen[Person.Name] = {
    Bereich: Person.Bereich,
    Amt: Person.Amt,
    Zusatz: Person.Zusatz
  }
  gmodFS.writeFile(lstrDatenpfad, globaleDaten.Optionen.Personen, 'utf-8')
}
export function Cache (globaleDaten, Optionen) {
  const lstrModus = Optionen.Modus
  delete Optionen.Modus
  globaleDaten[lstrModus] = Optionen
}
