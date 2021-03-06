var { google } = require('googleapis')
var OAuth2 = google.auth.OAuth2

export default {
  Daten_zur_Identifikation () {
    return {
      installed: {
        client_id: '1017951096928-ic22vb1t526njhb8fc1bmc1cb8mv1d0u.apps.googleusercontent.com',
        project_id: 'uebertragung',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: 'rjFApQRt2Qm9BEpeezGM0qgQ',
        redirect_uris: [
          'urn:ietf:wg:oauth:2.0:oob',
          'http://localhost'
        ]
      }
    }
  },
  Daten_fuer_den_Zugang () {
    return {
      access_token: 'ya29.a0AfH6SMCch6OwuUQsqy5kfJzxuXSSDeBd7UkP_RpntjYGIRyG8hGB8ay7rwhs25-UyxcLUquNEJdw9M1kmhH97wEgDrinJRNBtd454yA2oT34DGfJz-OyN4TaeJtkPfryT2HmW05zHLHgeQRwb7giUm8RBdMr8ZugGbYNUjYDiIk',
      refresh_token: '1//09GDmVj0hlD9vCgYIARAAGAkSNwF-L9IrIl4-qmpELwn5Q-UFU-4La64JxLVQmxKLu6crqw340-CitMcIRn8tDv0d4Kwc3s9g5jY',
      scope: 'https://www.googleapis.com/auth/youtube',
      token_type: 'Bearer',
      expiry_date: 1610120692213
    }
  },
  Authorisieren () {
    const Identifizierungsdaten = this.Daten_zur_Identifikation()
    var lstrKlient = Identifizierungsdaten.installed.client_secret
    var lstrKlientID = Identifizierungsdaten.installed.client_id
    var lstrUmleitungsadresse = Identifizierungsdaten.installed.redirect_uris[0]
    var lobjOAuth2Klient = new OAuth2(lstrKlientID, lstrKlient, lstrUmleitungsadresse)
    lobjOAuth2Klient.credentials = this.Daten_fuer_den_Zugang()
    return lobjOAuth2Klient
  },
  async holeUebertragungen () {
    const lobjAuthentifizierungsdaten = this.Authorisieren()
    const Uebertragungen = google.youtube('v3')
    const lobjErgebnis = await Uebertragungen.liveBroadcasts.list({
      auth: lobjAuthentifizierungsdaten,
      part: 'snippet',
      broadcastStatus: 'upcoming'
    })
    if (lobjErgebnis.data.items.length > 0) {
      return lobjErgebnis.data.items
    } else {
      return null
    }
  },
  async holeUebertragungsID () {
    let lboolGefunden = false
    const lobjAuthentifizierungsdaten = this.Authorisieren()
    let lmixUebertragungGefunden = false
    const Uebertragungen = google.youtube('v3')
    const lobjErgebnis = await Uebertragungen.liveBroadcasts.list({
      auth: lobjAuthentifizierungsdaten,
      part: 'snippet',
      broadcastStatus: 'upcoming'
    })
    if (lobjErgebnis.data.items.length > 0) {
      lobjErgebnis.data.items.forEach(lobjEintrag => {
        const larrDatum = this.Konverter(lobjEintrag.snippet.scheduledStartTime.split('T')[0].split('-'))
        const larrZeit = this.Konverter(lobjEintrag.snippet.scheduledStartTime.split('T')[1].replace('Z', '').split(':'), { Stelle: 0, Wert: 1 })
        const ldtJetzt = new Date()
        if (!lboolGefunden) {
          if (ldtJetzt.getFullYear() === larrDatum[0] && ldtJetzt.getMonth() === (larrDatum[1] - 1) && ldtJetzt.getDate() === larrDatum[2]) {
            if (ldtJetzt.getHours() < larrZeit[0]) {
              lmixUebertragungGefunden = lobjEintrag.id
              lboolGefunden = true
            }
          }
        }
      })
    }
    return lmixUebertragungGefunden
  },
  Schalter (UebertragungsID, Status) {
    const lobjAuthentifizierungsdaten = this.Authorisieren()
    var Uebertragungen = google.youtube('v3')
    Uebertragungen.liveBroadcasts.update({
      auth: lobjAuthentifizierungsdaten,
      part: 'status',
      resource: {
        id: UebertragungsID,
        status: {
          privacyStatus: Status // public / unlisted / private
        }
      }
    })
  },
  Konverter (Daten, Addition = null) {
    Daten.forEach((lstrWert, lintIndex) => {
      Daten[lintIndex] = parseInt(lstrWert)
      if (Addition !== null) {
        if (Addition.Stelle === lintIndex) {
          Daten[lintIndex] = Daten[lintIndex] + Addition.Wert
        }
      }
    })
    return Daten
  }
}
