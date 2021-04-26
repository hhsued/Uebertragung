
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
