
 <template lang="pug">
.q-pa-md
  .q-gutter-y-md
    q-card
      q-tabs.text-grey(
        v-model="Registerkarten",
        dense,
        active-color="primary",
        indicator-color="primary",
        align="justify",
        narrow-indicator
      )
        q-tab(name="Basiseinstellungen", label="Basiseinstellungen")
        q-tab(name="Kameras", label="Kameras")
        q-tab(name="Mikrofone", label="Mikrofone")
        q-tab(name="Perspektiven", label="Perspektiven")
        q-tab(name="Quellen", label="Quellen")
        q-tab(name="Szenen", label="Szenen")
      q-separator
      q-tab-panels(v-model="Registerkarten", animated)
        q-tab-panel(name="Basiseinstellungen")
          Basis
        q-tab-panel(name="Kameras")
          Kameras
        q-tab-panel(name="Mikrofone")
          Mikrofone
        q-tab-panel(name="Perspektiven")
          Perspektiven(Komponente="Basis")
        q-tab-panel(name="Quellen")
          Quellen
        q-tab-panel(name="Szenen")
          Szenen
</template>
<script>

import Basis from './Komponenten/Basis'
import Kameras from './Komponenten/Kameras'
import Mikrofone from './Komponenten/Mikrofone'
import Quellen from './Komponenten/Quellen'
import Szenen from './Komponenten/Szenen'
import Perspektiven from './../../Einzelkomponenten/PerspektivenEditor'
export default {
  name: 'Einstellungen',
  components: { Basis, Mikrofone, Kameras, Perspektiven, Quellen, Szenen },
  data: () => ({
    Registerkarten: 'Perspektiven'
  }),
  mounted () {
  },
  methods: {
  }
}
</script>
