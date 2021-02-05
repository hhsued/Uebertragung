import Vue from 'vue'
import Vuex from 'vuex'
import app from './app'
import StartEnde from './Start_Ende'
import Automatik from './Automatik'
import Allgemein from './Allgemein'
import Technik from './Technik'
import Textwort from './Textwort'
import Personen from './Personen'
import Lieder from './Lieder'
import Steuerung from './Steuerung'
// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      app,
      StartEnde,
      Automatik,
      Allgemein,
      Technik,
      Textwort,
      Personen,
      Lieder,
      Steuerung
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
