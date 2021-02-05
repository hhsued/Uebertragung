
export function laden (globaleDaten) {
}
export function setze (globaleDaten, Optionen) {
  Object.keys(Optionen).forEach(lstrWert => {
    globaleDaten[lstrWert] = Optionen[lstrWert]
  })
}
