<template lang="pug">
div
  Automatik(
    @Automatik="Automatik = $event",
    @Aufgabensammlung="Aufgabensammlung = $event"
  )
  div(style="margin-left: 10%; margin-right: 10%")
    .row
      Uebertragung
      Perspektiven
      Steuerung
      Kameras
      Mikrofone
  hr
  div(style="margin-left: 10%; margin-right: 10%")
    q-select(
      v-model="Vorgabe",
      label="Vorgabe für diese Übertragung",
      dense,
      :options="Vorgaben",
      @input="on_Vorgabe"
    )
      template(v-slot:after)
        q-btn(round, dense, flat, icon="refresh", @click="on_hole_Vorgaben")
  hr
  q-btn-toggle(
    @input="on_geaendert",
    style="margin-left: 10px; margin-right: 10px",
    spread,
    rounded,
    dense,
    unelevated,
    v-model="Komponente",
    toggle-color="primary",
    :options="Komponenten"
  )
  component(:is="Komponente", @Automatik_neu="on_Automatik_neu")
  div(v-if="$store.state.app.Fehlersuche")
    .text-h6 Automatik-Plan
    | {{ Planung }}
</template>

<script>
const lmodJoin = require("path").join;

const lstrURL = "https://ugd.hh-sued.de/uebertragungen.php";

import StartEnde from "./Start_Ende/Start_Ende";
import Allgemein from "./Allgemein/Allgemein";
import Textwort from "./Textwort/Textwort";
import Personen from "./Personen/Personen";
import Lieder from "./Lieder/Lieder";
import Automatik from "./Komponenten/Automatik";
import Perspektiven from "./Komponenten/Perspektiven";
import Steuerung from "./Komponenten/Steuerung";
import Kameras from "./Komponenten/Kameras";
import Mikrofone from "./Komponenten/Mikrofone";
import Uebertragung from "./Komponenten/Übertragung";

export default {
  name: "Live",
  components: {
    Lieder,
    Personen,
    Automatik,
    Textwort,
    Kameras,
    Mikrofone,
    Perspektiven,
    Steuerung,
    Allgemein,
    StartEnde,
    Uebertragung
  },
  data: () => ({
    Vorgaben: [],
    Vorgabe: null,
    Aufgaben: null,
    Szenen: {},
    Quellen: {},
    Planung: {},
    Funktion: null,
    Standardperspektive: false,
    Aufgabensammlung: null,
    Automatik: false,
    Komponente: "StartEnde",
    Komponenten: [
      { label: "Start / Ende", value: "StartEnde" },
      { label: "Allgemein", value: "Allgemein" },
      { label: "Textwort", value: "Textwort" },
      { label: "Personen", value: "Personen" },
      { label: "Lieder", value: "Lieder" }
    ]
  }),
  watch: {
    Automatik: {
      immediate: true,
      handler(NeuerWert, AlterWert) {
        if (NeuerWert) {
          this.Automatik = true;
          this.$store.commit("app/setze", { Automatik: true });
          this.$Log.Schreibe("Die Automatik wurde vom Benutzer aktiviert");
          this.Automatische_Verarbeitung();
        } else {
          this.$Log.Schreibe("Die Automatik wurde vom Benutzer deaktiviert");
          this.Planung = {};
          clearInterval(this.Funktion);
        }
      }
    }
  },
  beforeMount() {},
  mounted() {
    this.$Log.Schreibe(
      "----------------------------- Basissystem wurde geladen"
    );
    this.on_hole_Vorgaben();
    this.Szenen = this.$E.Daten_laden("StartEnde", "Szenen");
    this.Quellen = this.$E.Daten_laden("StartEnde", "Quellen");

    /* if (!this.$store.state.app.Automatik) {
      this.$q.dialog({
        title: 'Automatik',
        message: 'Möchtest Du jetzt die Automatik einschalten?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.Automatik = true
      }).onCancel(() => {
        this.Automatik = false
      })
    } */
    const lobjDaten = this.$E.Sitzung_laden("Module");
    this.Komponente = lobjDaten.Komponente;
    this.$OBS.Überblendung("setzen", "Überblende");
  },
  methods: {
    async on_Vorgabe() {
      const lobjResponse = await fetch(
        lstrURL + "?Aktion=Vorgabe&Vorgabe=" + this.Vorgabe,
        {}
      );
      this.$Log.Schreibe("Die Vorgabe " + this.Vorgabe + " wurde geladen");
      this.$store.commit("Steuerung/setzeVorgabe", await lobjResponse.json());
    },
    async on_hole_Vorgaben() {
      const lobjResponse = await fetch(lstrURL + "?Aktion=Vorgaben", {});
      this.Vorgaben = await lobjResponse.json();
      this.$q.notify("Vorgaben vom Server geladen");
      this.$Log.Schreibe("Die Vorgaben wurden vom Server geladen");
    },
    on_Automatik_neu() {
      if (this.Automatik) {
        this.Planung = {};
        this.Funktion = null;
        this.Automatik = true;
        this.$store.commit("app/setze", { Automatik: true });
        this.$Log.Schreibe(
          "Durch eine Änderung an den Einstellungen der Automatik durch den Benutzer wurde die Automatik neu geladen"
        );
        this.Automatische_Verarbeitung();
      }
    },
    on_geaendert() {
      this.$E.Sitzung_speichern("Module", {
        Komponente: this.Werte.Komponente
      });
      this.$Log.Schreibe(
        "Sitzung gespeichert: Module -> " + this.Werte.Komponente
      );
    },
    Planungspruefung(Uhrzeit) {
      if (this.Planung[Uhrzeit[0]] === undefined) {
        this.Planung[Uhrzeit[0]] = {};
        this.Planung[Uhrzeit[0]][Uhrzeit[1]] = [];
      }
      if (this.Planung[Uhrzeit[0]] !== undefined) {
        if (this.Planung[Uhrzeit[0]][Uhrzeit[1]] === undefined) {
          this.Planung[Uhrzeit[0]][Uhrzeit[1]] = [];
        }
      }
    },
    Aufgabe_eintragen(Zeit, Aufgabe) {
      this.Planung[Zeit[0]][Zeit[1]].push(Aufgabe);
      this.$Log.Schreibe(
        "Neue Aufgabe in den Laufzeitaufgabenplan eingetragen (" + Aufgabe + ")"
      );
    },
    Aufgabe_Zeit(Aufgabe, Zeitname) {
      const larrZeitpunkt = this.Aufgaben[Aufgabe][Zeitname].split(":");
      larrZeitpunkt[0] = parseInt(larrZeitpunkt[0]);
      larrZeitpunkt[1] = parseInt(larrZeitpunkt[1]);
      return larrZeitpunkt;
    },
    Aufgabe_Zeitpunkt(Aufgabe) {
      if (this.Aufgaben[Aufgabe].Aktiv) {
        const larrZeitpunkt = this.Aufgabe_Zeit(Aufgabe, "Zeitpunkt");
        const lintMinute = new Date().getMinutes();
        const lintStunde = new Date().getHours();
        if (lintStunde === larrZeitpunkt[0]) {
          if (lintMinute > larrZeitpunkt[1]) {
            this.$Log.Schreibe(
              "Die Aufgabe neu erstelle Aufgabe " +
                Aufgabe +
                " hat einen Ausführungszeitpunkt, welcher schon vergangen ist, führe die Aufgabe aus"
            );
            this.on_Aufgabe(Aufgabe);
          } else {
            this.Planungspruefung(larrZeitpunkt);
            this.Aufgabe_eintragen(larrZeitpunkt, Aufgabe);
          }
        } else {
          this.Planungspruefung(larrZeitpunkt);
          this.Aufgabe_eintragen(larrZeitpunkt, Aufgabe);
        }
      }
    },
    Aufgabe_Countdown_aufbauen() {
      const larrStartzeit = this.Aufgabe_Zeit("Countdown", "Startzeit");
      const larrZielzeit = this.Aufgabe_Zeit("Countdown", "Zielzeit");
      let lboolAufgabePlanen = true;
      if (larrStartzeit[0] > larrZielzeit[0]) {
        this.$q.notify(
          "Countdown: Die Startzeit ist größer als die Zielzeit -> Startzeit: " +
            larrStartzeit +
            ", Zielzeit -> " +
            larrZielzeit
        );
        lboolAufgabePlanen = false;
      } else if (larrStartzeit[0] === larrZielzeit[0]) {
        if (larrStartzeit[1] > larrZielzeit[1]) {
          this.$q.notify(
            "Countdown: Die Startzeit ist größer als die Zielzeit -> Startzeit: " +
              larrStartzeit +
              ", Zielzeit -> " +
              larrZielzeit
          );
          lboolAufgabePlanen = false;
        }
      }

      if (lboolAufgabePlanen) {
        for (
          let lintStunde = larrStartzeit[0];
          lintStunde <= larrZielzeit[0];
          lintStunde++
        ) {
          if (lintStunde === larrZielzeit[0]) {
            for (
              let lintMinute = larrStartzeit[1];
              lintMinute <= larrZielzeit[1];
              lintMinute++
            ) {
              this.Planungspruefung([lintStunde, lintMinute]);
              this.Aufgabe_eintragen([lintStunde, lintMinute], "Countdown");
            }
          }
          if (lintStunde < larrZielzeit[0]) {
            for (
              let lintMinute = larrStartzeit[1];
              lintMinute <= 59;
              lintMinute++
            ) {
              this.Planungspruefung([lintStunde, lintMinute]);
              this.Aufgabe_eintragen([lintStunde, lintMinute], "Countdown");
            }
            larrStartzeit[1] = 0;
          }
        }
      }
      this.$Log.Schreibe("Aufgabe Countdown aufgebaut");
    },
    Aufgabe_Sondereinblendung_aufbauen_naechste_Aktion(
      SondereinblendungSichtbar,
      NaechsteAktion
    ) {
      if (SondereinblendungSichtbar) {
        NaechsteAktion[1] += this.Aufgaben.Sondereinblendung.Länge;
        if (NaechsteAktion[1] === 60) {
          NaechsteAktion[0]++;
          NaechsteAktion[1] = 0;
        }
      } else {
        NaechsteAktion[1] +=
          this.Aufgaben.Sondereinblendung.Intervall -
          this.Aufgaben.Sondereinblendung.Länge;
        if (NaechsteAktion[1] === 60) {
          NaechsteAktion[0]++;
          NaechsteAktion[1] = 0;
        }
      }
      return NaechsteAktion;
    },
    Aufgabe_Sondereinblendung_aufbauen() {
      const larrStartzeit = this.Aufgabe_Zeit("Sondereinblendung", "Startzeit");
      const larrZielzeit = this.Aufgabe_Zeit("Sondereinblendung", "Endzeit");
      let larrNaechsteAktion = [larrStartzeit[0], larrStartzeit[1]];
      let lboolSondereinblendungSichtbar = false;

      this.Planungspruefung(larrStartzeit);
      this.Aufgabe_eintragen(larrStartzeit, "Sondereinblendung");
      lboolSondereinblendungSichtbar = true;
      larrNaechsteAktion = this.Aufgabe_Sondereinblendung_aufbauen_naechste_Aktion(
        lboolSondereinblendungSichtbar,
        larrNaechsteAktion
      );
      for (
        let lintStunde = larrStartzeit[0];
        lintStunde <= larrZielzeit[0];
        lintStunde++
      ) {
        if (lintStunde === larrZielzeit[0]) {
          for (
            let lintMinute = larrStartzeit[1];
            lintMinute <= larrZielzeit[1];
            lintMinute++
          ) {
            if (lintStunde === larrNaechsteAktion[0]) {
              if (lintMinute === larrNaechsteAktion[1]) {
                this.Planungspruefung([lintStunde, lintMinute]);
                this.Aufgabe_eintragen(
                  [lintStunde, lintMinute],
                  "Sondereinblendung"
                );
                lboolSondereinblendungSichtbar = !lboolSondereinblendungSichtbar;
                larrNaechsteAktion = this.Aufgabe_Sondereinblendung_aufbauen_naechste_Aktion(
                  lboolSondereinblendungSichtbar,
                  larrNaechsteAktion
                );
              }
            }
          }
        }
        if (lintStunde < larrZielzeit[0]) {
          for (
            let lintMinute = larrStartzeit[1];
            lintMinute <= 59;
            lintMinute++
          ) {
            if (lintStunde === larrNaechsteAktion[0]) {
              if (lintMinute === larrNaechsteAktion[1]) {
                this.Planungspruefung([lintStunde, lintMinute]);
                this.Aufgabe_eintragen(
                  [lintStunde, lintMinute],
                  "Sondereinblendung"
                );
                lboolSondereinblendungSichtbar = !lboolSondereinblendungSichtbar;
                larrNaechsteAktion = this.Aufgabe_Sondereinblendung_aufbauen_naechste_Aktion(
                  lboolSondereinblendungSichtbar,
                  larrNaechsteAktion
                );
              }
            }
          }
          larrStartzeit[1] = 0;
        }
      }

      if (lboolSondereinblendungSichtbar) {
        this.Planungspruefung([
          larrZielzeit[0],
          larrZielzeit[1] + this.Aufgaben.Sondereinblendung.Länge
        ]);
        this.Aufgabe_eintragen(
          [
            larrZielzeit[0],
            larrZielzeit[1] + this.Aufgaben.Sondereinblendung.Länge
          ],
          "Sondereinblendung"
        );
      }
      this.$Log.Schreibe("Aufgabe Sondereinblendung aufgebaut");
    },
    Aufgaben_aufbauen() {
      this.$Log.Schreibe(
        "Starte das Aufbauen der Laufzeitaufgabenverarbeitung"
      );
      this.Aufgaben = this.$E.laden(
        this.Aufgabensammlung,
        lmodJoin(process.cwd(), "Daten", "Aufgaben")
      );
      // Starten
      this.Aufgabe_Zeitpunkt("Starten");
      // Countdown
      if (this.Aufgaben.Countdown.Aktiv) {
        this.Aufgabe_Countdown_aufbauen();
      }
      // Sondereinblendung
      if (this.Aufgaben.Sondereinblendung.Aktiv) {
        this.Aufgabe_Sondereinblendung_aufbauen();
      }
      // Vorspann
      this.Aufgabe_Zeitpunkt("Vorspann");
      // Sichtbar
      this.Aufgabe_Zeitpunkt("Sichtbar");
      // Unsichtbar
      this.Aufgabe_Zeitpunkt("Unsichtbar");
      // Automatik aus
      this.Aufgabe_Zeitpunkt("Automatik_aus");

      this.$q.notify("Automatikzeitplan aufgebaut!");
    },
    Automatische_Verarbeitung() {
      if (Object.keys(this.Planung).length === 0) {
        this.$Log.Schreibe(
          "Noch keine Laufzeitaufgabenverarbeitung vorhanden, baue sie nun auf"
        );
        this.Aufgaben_aufbauen();
      }
      this.$Log.Schreibe(
        "Schaue nach, ob nach dem Aufbau der Laufzeitaufgabenverabeitung etwas auszuführen ist"
      );
      this.Aufgabe_ausfuehren();
      this.Funktion = setInterval(() => {
        this.$Log.Schreibe(
          "60 Sekundenintervall vergangen, prüfe, ob Aufgaben abzuarbeiten sind"
        );
        this.Aufgabe_ausfuehren();
      }, 60000); // 60000
    },
    Aufgabe_ausfuehren() {
      const lintMinute = new Date().getMinutes();
      const lintStunde = new Date().getHours();
      this.$Log.Schreibe(
        "Führe Aufgaben aus! Stunde: " + lintStunde + ", Minute: " + lintMinute
      );
      if (this.$store.state.app.Fehlersuche) {
        this.$q.notify(
          "lintStunde = " + lintStunde + ", lintMinute = " + lintMinute
        );
      }

      if (
        this.Planung[lintStunde] !== undefined &&
        this.Planung[lintStunde][lintMinute] !== undefined &&
        this.Planung[lintStunde][lintMinute].length > 0
      ) {
        if (this.$store.state.app.Fehlersuche) {
          this.$q.notify("Ich habe etwas gefunden");
        }
        this.Planung[lintStunde][lintMinute].forEach(lstrAufgabe => {
          if (this.$store.state.app.Fehlersuche) {
            this.$q.notify("Aufgabe: " + lstrAufgabe);
          }
          this.$Log.Schreibe(
            "Habe eine Aufgabe gefunden (" +
              lintStunde +
              ":" +
              lintMinute +
              "): " +
              lstrAufgabe
          );
          this.on_Aufgabe(lstrAufgabe);
        });
      }
    },
    Aufgabe_Countdown() {
      this.$Log.Schreibe("Aufgabe Countdown");
      if (!this.$OBS.Verbindung()._connected) {
        this.$Log.Schreibe("Aufgabe Countdown: Keine Verbindung zum OBS");
        this.$q.notify(
          "Konnte die Aufgabe nicht ausführen, da keine Verbindung zum OBS besteht!"
        );
        return;
      }
      let lstrText = "";
      const larrZielzeit = this.Aufgabe_Zeit("Countdown", "Zielzeit");

      const lintMinuten =
        larrZielzeit[0] * 60 +
        larrZielzeit[1] -
        (new Date().getHours() * 60 + new Date().getMinutes());
      const lstrMinutenText = lintMinuten > 1 ? "Minuten" : "Minute";

      if (lintMinuten > 0) {
        lstrText =
          "Start der Übertragung in " +
          lintMinuten.toString() +
          " " +
          lstrMinutenText;
      }
      if (lintMinuten === 0) {
        lstrText = "Start der Übertragung";
      }
      this.$OBS.Text(
        this.Quellen.Anfang_Übertragungsstart,
        lstrText,
        70,
        "Arial"
      );
      this.$OBS.Sichtbarkeit(
        this.Szenen.Warten,
        this.Quellen.Anfang_Übertragungsstart,
        true
      );
      this.$q.notify("Aufgabe: Countdown wurde aktualisiert");
    },
    async Aufgabe_Sondereinblendung() {
      this.$Log.Schreibe("Aufgabe Sondereinblendung");
      if (!this.$OBS.Verbindung()._connected) {
        this.$Log.Schreibe(
          "Aufgabe Sondereinblendung! Keine Verbindung zum OBS"
        );
        this.$q.notify(
          "Konnte die Aufgabe nicht ausführen, da keine Verbindung zum OBS besteht!"
        );
        return;
      }
      const lobjAktuelleSzene = await this.$OBS.Szene("Aktuelle");
      if (lobjAktuelleSzene.name === this.Szenen.Sondereinblendung) {
        this.$OBS.Szene("Vorschau", this.Szenen.Warten);
        this.$OBS.Szene("Live", this.Szenen.Warten, 3000);
        this.$q.notify("Aufgabe: Sondereinblendung wurde ausgeblendet");
      } else {
        this.$OBS.Szene("Vorschau", this.Szenen.Sondereinblendung);
        this.$OBS.Szene("Live", this.Szenen.Sondereinblendung, 3000);
        this.$q.notify("Aufgabe: Sondereinblendung wurde eingeblendet");
      }
    },
    Aufgabe_Vorspann() {
      this.$Log.Schreibe("Aufgabe Vorspann");
      if (!this.$OBS.Verbindung()._connected) {
        this.$Log.Schreibe("Aufgabe Vorspann! Keine Verbindung zum OBS");
        this.$q.notify(
          "Konnte die Aufgabe nicht ausführen, da keine Verbindung zum OBS besteht!"
        );
        return;
      }
      this.$OBS.Szene("Vorschau", this.Szenen.Vorspann);
      this.$OBS.Szene("Live", this.Szenen.Vorspann, 3000);
      setTimeout(() => {
        this.Aufgabe_Live();
      }, 25000);
      this.$q.notify("Aufgabe: Vorspann starten wurde ausgeführt");
    },
    Aufgabe_Live() {
      this.$Log.Schreibe("Aufgabe Live");
      if (!this.$OBS.Verbindung()._connected) {
        this.$Log.Schreibe("Aufgabe Live! Keine Verbindung zum OBS");
        this.$q.notify(
          "Konnte die Aufgabe nicht ausführen, da keine Verbindung zum OBS besteht!"
        );
        return;
      }
      this.$OBS.Sichtbarkeit(this.Szenen.Live, this.Quellen.Livekamera, true);
      if (typeof this.Quellen.Liveton !== "string") {
        this.Quellen.Liveton.forEach(lstrTon => {
          this.$OBS.Sichtbarkeit(this.Szenen.Live, lstrTon, true);
        });
      } else {
        this.$OBS.Sichtbarkeit(this.Szenen.Live, this.Quellen.Liveton, true);
      }

      this.$OBS.Szene("Vorschau", this.Szenen.Live);
      this.$OBS.Szene("Live", this.Szenen.Live, 3000);
      this.$q.notify("Aufgabe: Livebild einblenden wurde ausgeführt");
    },
    Aufgabe_sichtbar() {
      this.$Log.Schreibe("Aufgabe YouTube-Sichtbar");
      if (!this.$store.state.app.YouTubeID) {
        this.$Log.Schreibe(
          "Keine passende YouTube-ID für die Aktion YouTube-Sichtbar"
        );
        this.$q.notify(
          "Es wurde keine passende YouTube-Übertragung für heute gefunden. Kann den Befehl nicht ausführen!"
        );
        return;
      }
      this.$YT.Schalter(this.$store.state.app.YouTubeID, "public");
      this.$Log.Schreibe("YouTube wurde auf sichtbar geschaltet");
      this.$q.notify(
        "Aufgabe: YouTube-Übertragung auf 'sichtbar' setzen wurde ausgeführt"
      );
    },
    Aufgabe_unsichtbar() {
      this.$Log.Schreibe("Aufgabe YouTube-Unsichtbar");
      if (!this.$store.state.app.YouTubeID) {
        this.$Log.Schreibe(
          "Keine passende YouTube-ID für die Aktion YouTube-Unsichtbar"
        );
        this.$q.notify(
          "Es wurde keine passende YouTube-Übertragung für heute gefunden. Kann den Befehl nicht ausführen!"
        );
        return;
      }
      this.$YT.Schalter(this.$store.state.app.YouTubeID, "unlisted");
      this.$Log.Schreibe("YouTube wurde auf unsichtbar geschaltet");
      this.$q.notify(
        "Aufgabe: YouTube-Übertragung auf 'unsichtbar' setzen wurde ausgeführt"
      );
    },
    Stellen(Sollanzahl, Wert) {
      let lstrWert = "";
      Wert = Wert.toString();

      if (Wert.length < Sollanzahl) {
        for (let lintZaehler = 0; lintZaehler < Sollanzahl - 1; lintZaehler++) {
          lstrWert += "0";
        }
      }
      return lstrWert + Wert;
    },
    Starten(Aktion) {
      this.$Log.Schreibe(
        "Start der Übertragung an YouTube: Vorbereitungen der Ansicht des Wartebildschirms"
      );
      const larrSzenen = this.$E.Daten_laden("StartEnde", "Szenen");
      const larrQuellen = this.$E.Daten_laden("StartEnde", "Quellen");

      const lobjAnsichtskonfiguration = [];

      if (this.$store.state.StartEnde.Art !== "ohne") {
        lobjAnsichtskonfiguration.push({
          Typ: "Text",
          Szene: larrSzenen.Warten,
          Quelle: larrQuellen.Anfang_Gottesdienstart,
          Text: this.$store.state.StartEnde.Art,
          Schriftgröße: 150,
          Schriftart: "Arial",
          Kontur: false
        });
      } else {
        this.$OBS.Sichtbarkeit(
          larrSzenen.Warten,
          larrQuellen.Anfang_Gottesdienstart,
          false
        );
      }

      if (this.$store.state.StartEnde.Datum) {
        lobjAnsichtskonfiguration.push({
          Typ: "Text",
          Quelle: larrQuellen.Anfang_Datum,
          Szene: larrSzenen.Warten,
          Text:
            this.Stellen(2, new Date().getDate()) +
            "." +
            this.Stellen(2, new Date().getMonth() + 1) +
            "." +
            this.Stellen(4, new Date().getFullYear()),
          Schriftgröße: 150,
          Schriftart: "Arial",
          Kontur: false
        });
      } else {
        this.$OBS.Sichtbarkeit(
          larrSzenen.Warten,
          larrQuellen.Anfang_Datum,
          false
        );
      }
      if (this.$store.state.StartEnde.Hinweis) {
        lobjAnsichtskonfiguration.push({
          Typ: "Text",
          Quelle: larrQuellen.Anfang_Starthinweise,
          Szene: larrSzenen.Warten,
          Text: this.$store.state.StartEnde.Hinweistext,
          Schriftgröße: 60,
          Schriftart: "Arial",
          Kontur: false
        });
      } else {
        this.$OBS.Sichtbarkeit(
          larrSzenen.Warten,
          larrQuellen.Anfang_Starthinweise,
          false
        );
      }
      if (this.$store.state.StartEnde.Startuhrzeit) {
        if (this.$store.state.StartEnde.Startzeit !== "") {
          lobjAnsichtskonfiguration.push({
            Typ: "Text",
            Quelle: larrQuellen.Anfang_Beginn,
            Szene: larrSzenen.Warten,
            Text: "Beginn: " + this.$store.state.StartEnde.Startzeit,
            Schriftgröße: 90,
            Schriftart: "Arial",
            Kontur: false
          });
        } else {
          this.$OBS.Sichtbarkeit(
            larrSzenen.Warten,
            larrQuellen.Anfang_Beginn,
            false
          );
        }
      } else {
        this.$OBS.Sichtbarkeit(
          larrSzenen.Warten,
          larrQuellen.Anfang_Beginn,
          false
        );
      }

      this.$Helfer.Aktionen(
        Aktion,
        larrSzenen.Warten,
        "StartEnde",
        this.Standardperspektive,
        this.$store,
        lobjAnsichtskonfiguration
      );
    },
    on_Aufgabe(Aufgabe) {
      switch (Aufgabe) {
        case "Starten":
          this.Starten("Live");
          this.$OBS.Stream("starten");
          this.$store.commit("app/setze", { Übertragung_läuft: true });
          this.$q.notify("Aufgabe: Die Übertragung wurde gestartet");
          break;
        case "Countdown":
          this.Aufgabe_Countdown();
          // this.Aufgabe_Sondereinblendung()
          break;
        case "Sondereinblendung":
          this.Aufgabe_Sondereinblendung();
          break;
        case "Vorspann":
          this.Aufgabe_Vorspann();
          break;
        case "Live":
          this.Aufgabe_Live();
          break;
        case "Sichtbar":
          this.Aufgabe_sichtbar();
          break;
        case "Unsichtbar":
          this.Aufgabe_unsichtbar();
          break;
        case "Automatik_aus":
          this.$Log.Schreibe("Die Automatik wurde geplant ausgeschaltet");
          this.$store.commit("app/setze", { Automatik: false });
          this.Planung = {};
          clearInterval(this.Funktion);
          this.$q.notify("Aufgabe: Die Automatik wurde deaktiviert");
          break;
      }
    }
  }
};
</script>
