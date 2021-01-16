
import lmodE from '../../libs/Einstellungen'
export function laden (globaleDaten) {
  globaleDaten.Aufgaben = lmodE.laden('Aufgaben')
}
