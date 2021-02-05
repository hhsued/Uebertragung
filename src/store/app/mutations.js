/* eslint-disable camelcase */
import gmodE from '../../libs/Einstellungen'
export function laden (globaleDaten) {
  globaleDaten.Kameras = Kameras_initieren(gmodE.Daten_laden('Basis', 'Kameras'))
  globaleDaten.Mikrofone = Mikrofone_initieren(gmodE.Daten_laden('Basis', 'Mikrofone'))
  globaleDaten.Version = gmodE.laden('Version').Version
}
export function Kameras_initieren (Kameras) {
  Kameras.forEach(lobjKamera => {
    lobjKamera.Hintergrund = 'white'
    lobjKamera.Text = 'black'
    lobjKamera.nicht_verfuegbar = false
  })
  return Kameras
}
export function Mikrofone_initieren (Mikrofone) {
  Mikrofone.forEach(lobjMikrofon => {
    lobjMikrofon.Hintergrund = 'white'
    lobjMikrofon.Text = 'black'
  })
  return Mikrofone
}
export function setze (globaleDaten, Optionen) {
  Object.keys(Optionen).forEach(lstrWert => {
    globaleDaten[lstrWert] = Optionen[lstrWert]
  })
}
export function Automatik (globaleDaten, Status) {
  globaleDaten.Automatik = Status
}
export function Mikrofon_vorbereiten (globaleDaten, Index) {
  if (typeof (Index) === 'string') {
    Index = wandleZuIndex(globaleDaten, 'Mikrofone', Index)
  }
  switch (globaleDaten.Mikrofone[Index].Hintergrund) {
    case 'warning':
    case 'primary':
      globaleDaten.Mikrofone[Index].Hintergrund = 'white'
      globaleDaten.Mikrofone[Index].Text = 'black'
      break
    case 'white':
      globaleDaten.Mikrofone[Index].Hintergrund = 'warning'
      globaleDaten.Mikrofone[Index].Text = 'white'
      break
  }
}
export function Mikrofon_live (globaleDaten) {
  Object.keys(globaleDaten.Mikrofone).forEach(lstrMikrofon => {
    if (globaleDaten.Mikrofone[lstrMikrofon].Hintergrund === 'warning') {
      globaleDaten.Mikrofone[lstrMikrofon].Hintergrund = 'primary'
      globaleDaten.Mikrofone[lstrMikrofon].Text = 'white'
    }
  })
}
export function wandleZuIndex (globaleDaten, Was, Name) {
  globaleDaten[Was].forEach((lobjObjekt, lintIndex) => {
    if (lobjObjekt.Quelle === Name) {
      return lintIndex
    }
  })
}
export function Kamera_vorbereiten (globaleDaten, Index) {
  if (typeof (Index) === 'string') {
    Index = wandleZuIndex(globaleDaten, 'Kameras', Index)
  }
  globaleDaten.Kameras.forEach((lobjKamera, lintIndex) => {
    if (lintIndex === Index) {
      switch (globaleDaten.Kameras[lintIndex].Hintergrund) {
        case 'warning':
          globaleDaten.Kameras[lintIndex].Hintergrund = 'white'
          globaleDaten.Kameras[lintIndex].Text = 'black'
          break
        case 'white':
          globaleDaten.Kameras[lintIndex].Hintergrund = 'warning'
          globaleDaten.Kameras[lintIndex].Text = 'white'
          break
      }
    } else {
      if (globaleDaten.Kameras[lintIndex].Hintergrund === 'warning') {
        globaleDaten.Kameras[lintIndex].Hintergrund = 'white'
        globaleDaten.Kameras[lintIndex].Text = 'black'
      }
    }
  })
}
export function Kamera_ändern (globaleDaten, Perspektive) {
  let lstrKamera = ''
  if (typeof (Perspektive) === 'object') {
    lstrKamera = Perspektive.Kamera
  } else {
    const lobjPerspektiven = gmodE.Daten_laden('Basis', 'Perspektiven')
    lstrKamera = lobjPerspektiven[Perspektive].aktiv.Kamera
  }
  globaleDaten.Kameras.forEach(lobjKamera => {
    if (lobjKamera.Quelle === lstrKamera) {
      lobjKamera.Hintergrund = 'primary'
      lobjKamera.Text = 'white'
    } else {
      lobjKamera.Hintergrund = 'white'
      lobjKamera.Text = 'black'
    }
  })
}
export function Mikrofone_ändern (globaleDaten, Perspektive) {
  let larrMikrofone = null
  let lboolZugewiesen = false
  if (typeof (Perspektive) === 'string') {
    const lobjPerspektiven = gmodE.Daten_laden('Basis', 'Perspektiven')
    larrMikrofone = lobjPerspektiven[Perspektive].aktiv.Mikros
    lboolZugewiesen = true
  }
  if (typeof (Perspektive) === 'object' && !lboolZugewiesen) {
    larrMikrofone = Perspektive.Mikrofone
    lboolZugewiesen = true
  }
  if (Array.isArray(Perspektive) && !lboolZugewiesen) {
    larrMikrofone = Perspektive
  }
  globaleDaten.Mikrofone.forEach(lobjMikro => {
    if (larrMikrofone.includes(lobjMikro.Quelle)) {
      lobjMikro.Hintergrund = 'primary'
      lobjMikro.Text = 'white'
    } else {
      lobjMikro.Hintergrund = 'white'
      lobjMikro.Text = 'black'
    }
  })
}
export function Kamera_live (globaleDaten) {
  let lbool_Aktive_Kamera = false
  let lbool_Vorbereitete_Kamera = false
  let lbool_Verarbeiten = false
  Object.keys(globaleDaten.Kameras).forEach(lstrKamera => {
    if (globaleDaten.Kameras[lstrKamera].Hintergrund === 'warning') {
      lbool_Vorbereitete_Kamera = true
    }
    if (globaleDaten.Kameras[lstrKamera].Hintergrund === 'primary') {
      lbool_Aktive_Kamera = true
    }
  })
  /*
    lbool_Aktive_Kamera = false
    lbool_Vorbereitete_Kamera = false
    Es wird nichts geändert
    ------------------------------------
    lbool_Aktive_Kamera = true
    lbool_Vorbereitete_Kamera = false
    Es wird nichts geändert
    ------------------------------------
    lbool_Aktive_Kamera = true
    lbool_Vorbereitete_Kamera = true
    Eine neue aktive Kamera wird gesetzt
    ------------------------------------
    lbool_Aktive_Kamera = false
    lbool_Vorbereitete_Kamera = true
    Keine Kamera war aktiv, es wird eine gesetzt
  */
  if (lbool_Aktive_Kamera === true && lbool_Vorbereitete_Kamera === true) {
    lbool_Verarbeiten = true
  }
  if (lbool_Aktive_Kamera === false && lbool_Vorbereitete_Kamera === true) {
    lbool_Verarbeiten = true
  }
  if (lbool_Verarbeiten) {
    Object.keys(globaleDaten.Kameras).forEach(lstrKamera => {
      if (globaleDaten.Kameras[lstrKamera].Hintergrund === 'warning') {
        globaleDaten.Kameras[lstrKamera].Hintergrund = 'primary'
        globaleDaten.Kameras[lstrKamera].Text = 'white'
        globaleDaten.Kameras[lstrKamera].nicht_verfuegbar = true
      } else {
        globaleDaten.Kameras[lstrKamera].Hintergrund = 'white'
        globaleDaten.Kameras[lstrKamera].Text = 'black'
        globaleDaten.Kameras[lstrKamera].nicht_verfuegbar = false
      }
    })
  }
}
