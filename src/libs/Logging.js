const lmodPfad = require('path')
const lmodDS = require('fs')

const gstrLogPfad = lmodPfad.join(process.cwd(), 'Daten', 'Logs')
let gstrSitzungsname = ''
export default {
  NeueSitzung () {
    const ldtJetzt = new Date()
    gstrSitzungsname = ldtJetzt.getDate() + ldtJetzt.getMonth() + ldtJetzt.getFullYear() + '_' + ldtJetzt.getHours() + ldtJetzt.getMinutes() + ldtJetzt.getSeconds()
    lmodDS.closeSync(lmodDS.openSync(lmodPfad.join(gstrLogPfad, gstrSitzungsname), 'w'))
    lmodDS.appendFileSync(lmodPfad.join(gstrLogPfad, gstrSitzungsname), this.Zeitstempel() + 'Programm gestartet')
  },
  Zeitstempel () {
    const ldtJetzt = new Date()
    return '[' + ldtJetzt.getDate() + '.' + ldtJetzt.getMonth() + '.' + ldtJetzt.getFullYear() + ' - ' + ldtJetzt.getHours() + ':' + ldtJetzt.getMinutes() + ':' + ldtJetzt.getSeconds() + ']: '
  },
  Schreibe (Text) {
    lmodDS.appendFile(lmodPfad.join(gstrLogPfad, gstrSitzungsname), this.Zeitstempel() + Text, function (err) {
      if (err) throw err
    })
  }
}
