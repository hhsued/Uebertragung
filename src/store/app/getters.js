/* eslint-disable camelcase */
export function vorbereitete_Kamera (state) {
  let lstr_vorbereitete_Kamera = ''
  Object.keys(state.Kameras).forEach(lstr_Kamera => {
    if (state.Kameras[lstr_Kamera].Hintergrund === 'warning') {
      lstr_vorbereitete_Kamera = lstr_Kamera
    }
  })
  return lstr_vorbereitete_Kamera
}
export function aktive_Kamera (state) {
  let lstrAktiveKamera = ''
  Object.keys(state.Kameras).forEach(lstrKamera => {
    if (state.Kameras[lstrKamera].Hintergrund === 'primary') {
      lstrAktiveKamera = lstrKamera
    }
  })
  return lstrAktiveKamera
}
export function vorbereitete_Mikrofone (state) {
  const larrMikrofone = []
  Object.keys(state.Mikrofone).forEach(lstrMikrofon => {
    if (state.Mikrofone[lstrMikrofon].Hintergrund === 'warning') {
      larrMikrofone.push(lstrMikrofon)
    }
  })
  return larrMikrofone
}
export function aktive_Mikrofone (state) {
  const larrMikrofone = []
  Object.keys(state.Mikrofone).forEach(lstrMikrofon => {
    if (state.Mikrofone[lstrMikrofon].Hintergrund === 'primary') {
      larrMikrofone.push(lstrMikrofon)
    }
  })
  return larrMikrofone
}
