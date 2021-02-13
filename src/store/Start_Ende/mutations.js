
import lmodE from './../../libs/Einstellungen'
export function laden (globaleDaten) {
  const lobjKonfig = lmodE.Daten_laden('StartEnde', 'Start_Ende')
  globaleDaten.Standardwerte = lobjKonfig.Standardwerte
  globaleDaten.Optionen = lobjKonfig.Optionen
}
export function setze (globaleDaten, Optionen) {
  Object.keys(Optionen).forEach(lstrWert => {
    globaleDaten[lstrWert] = Optionen[lstrWert]
  })
}
export function Cache (globaleDaten, Optionen) {
  const lstrModus = Optionen.Modus
  delete Optionen.Modus
  globaleDaten[lstrModus] = Optionen
}
