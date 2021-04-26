
import lmodE from '../../libs/Einstellungen'
export function laden (globaleDaten) {
  const lobjDaten = lmodE.Daten_laden('Lieder', 'Optionen')
  Object.keys(lobjDaten).forEach(lstrSchluessel => {
    globaleDaten[lstrSchluessel] = lobjDaten[lstrSchluessel]
  })
}
export function setze (globaleDaten, Optionen) {
  Object.keys(Optionen).forEach(lstrWert => {
    globaleDaten[lstrWert] = Optionen[lstrWert]
  })
}
export function bearbeiten (globaleDaten, Optionen) {
  if (Optionen.aktivieren) {
    globaleDaten.Werte.Strophen[Optionen.Index].Bearbeitungsmodus = true
  } else {
    globaleDaten.Werte.Strophen[Optionen.Index].Bearbeitungsmodus = false
  }
}
export function StropheLoeschen (globaleDaten, Index) {
  globaleDaten.Strophen.splice(Index, 1)
}
export function Text (globaleDaten, Optionen) {
  globaleDaten.Werte.Strophen[Optionen.Index].Text = Optionen.Text
}
export function VorgabeHinzufügen (globaleDaten, Optionen) {
  globaleDaten.Vorgabe.push(Optionen)
}
export function VorgabeEntfernen (globaleDaten, Index) {
  globaleDaten.Vorgabe.splice(Index, 1)
}
export function Cache (globaleDaten, Optionen) {
  const lstrModus = Optionen.Modus
  delete Optionen.Modus
  globaleDaten[lstrModus] = Optionen
}
