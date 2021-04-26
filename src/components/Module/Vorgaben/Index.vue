<template lang="pug">
div
  q-dialog(v-model="Dialog")
    q-card
      q-card-section
        .text-h6 Neue Vorgabe
      q-card-section.q-pt-none
        q-input.full-width(
          dense,
          filled,
          v-model="DatumZeit",
          label="Datum und Zeit der neuen Vorgabe",
          hint="Datum und Zeit der neuen Vorgabe"
        )
          template(v-slot:prepend)
            q-icon.cursor-pointer(name="event")
              q-popup-proxy(transition-show="scale", transition-hide="scale")
                q-date(v-model="DatumZeit", mask="DD.MM.YYYY HH:mm")
                  .row.items-center.justify-end
                    q-btn(v-close-popup, label="Fertig", color="primary", flat)
          template(v-slot:append)
            q-icon.cursor-pointer(name="access_time")
              q-popup-proxy(transition-show="scale", transition-hide="scale")
                q-time(v-model="DatumZeit", mask="DD.MM.YYYY HH:mm", format24h)
                  .row.items-center.justify-end
                    q-btn(v-close-popup, label="Fertig", color="primary", flat)
      q-card-actions(align="right")
        q-btn(
          dense,
          v-if="DatumZeit !== null",
          flat,
          label="Erstellen",
          @click="on_Neu('Vorgabe')"
        )
        q-btn(flat, label="Abbruch", v-close-popup, @click="Dialog = !Dialog")
  div(style="margin-left: 10%; margin-right: 10%")
    q-select.full-width(
      dense,
      v-model="AktiveVorgabe",
      :options="Vorgaben",
      label="Verfügbare Vorgaben",
      @input="on_Vorgabe_gewaehlt"
    )
  q-toolbar
    q-btn.full-width(icon="add", unelevated, @click="on_Dialog")
  q-list.rounded-borders(bordered, v-if="Vorgabe !== null")
    q-card
      q-card-section
        q-toolbar
          q-btn.full-width(
            dense,
            icon="delete",
            unelevated,
            @click="on_Loeschen('Vorgabe')"
          )
          q-btn.full-width(
            icon="save",
            unelevated,
            @click="on_speichern",
            dense
          )
      q-card-section
        div(style="margin-left: 10%; margin-right: 10%")
          q-input.full-width(
            dense,
            filled,
            v-model="Vorgabe.Wann",
            label="Datum und Zeit"
          )
            template(v-slot:prepend)
              q-icon.cursor-pointer(name="event")
                q-popup-proxy(transition-show="scale", transition-hide="scale")
                  q-date(v-model="Vorgabe.Wann", mask="DD.MM.YYYY HH:mm")
                    .row.items-center.justify-end
                      q-btn(
                        v-close-popup,
                        label="Fertig",
                        color="primary",
                        flat
                      )
            template(v-slot:append)
              q-icon.cursor-pointer(name="access_time")
                q-popup-proxy(transition-show="scale", transition-hide="scale")
                  q-time(
                    v-model="Vorgabe.Wann",
                    mask="DD.MM.YYYY HH:mm",
                    format24h
                  )
                    .row.items-center.justify-end
                      q-btn(
                        v-close-popup,
                        label="Fertig",
                        color="primary",
                        flat
                      )
      q-card-section
        q-list
          q-expansion-item(
            dense,
            dense-toggle,
            expand-separator,
            label="Startbildschirm",
            default-opened,
            group="Inhalt",
            header-class="bg-primary text-white"
          )
            q-card
              q-card-section
                q-select(
                  dense,
                  label="Gottesdienstart",
                  v-model="Vorgabe.Startbildschirm.Art",
                  :options="['ohne', 'Gottesdienst', 'Jugendgottesdienst', 'Seniorengottesdienst', 'Kindergottesdienst', 'Bezirksgottesdienst']"
                )
              q-card-section
                q-checkbox(v-model="Vorgabe.Startbildschirm.Datum", dense) Datum anzeigen
              q-card-section
                div
                  q-checkbox(
                    v-model="Vorgabe.Startbildschirm.Startzeit",
                    dense
                  ) Startzeit
                div(v-if="Vorgabe.Startbildschirm.Startzeit")
                  q-input(
                    dense,
                    label="Uhrzeit",
                    mask="time",
                    :rules="['time']",
                    v-model="Vorgabe.Startbildschirm.Startuhrzeit"
                  )
              q-card-section
                div
                  q-checkbox(v-model="Vorgabe.Startbildschirm.Hinweis", dense) Hinweis anzeigen
                div(v-if="Vorgabe.Startbildschirm.Hinweis")
                  b Bitte den Text spätestens am rechten Rand durch Druck auf ENTER / RETURN umbrechen. Sonst läuft der Text aus dem Bild. Vorher kann ein Umbruch natürlich auch schon eingefügt werden werden
                  q-editor(
                    v-model="Vorgabe.Startbildschirm.Hinweistext",
                    :toolbar="[]",
                    style="width: 500px"
                  )
          q-expansion-item(
            dense,
            dense-toggle,
            expand-separator,
            label="Endbildschirm",
            group="Inhalt",
            header-class="bg-primary text-white"
          )
            q-card
              q-card-section
                div
                  q-checkbox(
                    v-model="Vorgabe.Endbildschirm.Hinweis_Ende",
                    dense
                  ) Hinweis am Ende der Übertragung anzeigen
                div(v-if="Vorgabe.Endbildschirm.Hinweis_Ende")
                  b Bitte den Text spätestens am rechten Rand durch Druck auf ENTER / RETURN umbrechen. Sonst läuft der Text aus dem Bild. Vorher kann ein Umbruch natürlich auch schon eingefügt werden werden
                  q-editor(
                    v-model="Vorgabe.Endbildschirm.Hinweis_Ende_Text",
                    :toolbar="[]",
                    style="width: 500px"
                  )
          q-expansion-item(
            dense,
            dense-toggle,
            expand-separator,
            label="Allgemein",
            group="Inhalt",
            header-class="bg-primary text-white"
          )
            q-card
              q-card-section
                div
                  q-checkbox(v-model="Vorgabe.Allgemein.Hinweis", dense) Hinweis anzeigen
                div(v-if="Vorgabe.Allgemein.Hinweis")
                  b Bitte den Text spätestens am rechten Rand durch Druck auf ENTER / RETURN umbrechen. Sonst läuft der Text aus dem Bild. Vorher kann ein Umbruch natürlich auch schon eingefügt werden werden
                  q-editor(
                    v-model="Vorgabe.Allgemein.Hinweistext",
                    :toolbar="[]",
                    style="width: 500px"
                  )
          q-expansion-item(
            dense,
            dense-toggle,
            expand-separator,
            label="Textworte",
            group="Inhalt",
            header-class="bg-primary text-white"
          )
            q-card
              q-card-section
                q-toolbar
                  q-btn.full-width(
                    dense,
                    icon="add",
                    unelevated,
                    @click="on_Neu('Textwort')"
                  )
              q-card-section
                q-list(bordered, separator)
                  q-item(
                    v-for="(Textwort, TI) in Vorgabe.Textworte",
                    :key="TI"
                  )
                    q-item-section(avatar)
                      q-btn.full-height(
                        dense,
                        icon="delete",
                        unelevated,
                        @click="on_Loeschen('Textwort', TI)"
                      )
                    q-item-section
                      .row
                        .col-xs-12.col-sm-6.col-md-2(
                          style="margin-left: 5px; margin-right: 5px"
                        )
                          q-input(
                            dense,
                            label="Bezeichnung",
                            v-model="Textwort.Bezeichnung",
                            hint="z.B. Gottesdienst oder Bibellesung",
                            :rules="[(val) => val.length >= 3 || 'Bitte mindestens 3 Buchstaben eingeben']"
                          )
                        .col-xs-12.col-sm-6.col-md-2(
                          v-if="Textwort.Bezeichnung.length >= 3",
                          style="margin-left: 5px; margin-right: 5px"
                        )
                          q-select(
                            dense,
                            label="Buch",
                            v-model="Textwort.Buch",
                            :options="Object.keys(Bibel)"
                          )
                        .col-xs-12.col-sm-6.col-md-2(
                          v-if="Textwort.Buch !== null",
                          style="margin-left: 5px; margin-right: 5px"
                        )
                          q-input(
                            dense,
                            label="Kapitel",
                            v-model.number="Textwort.Kapitel",
                            type="number"
                          )
                        .col-xs-12.col-sm-6.col-md-2(
                          v-if="Textwort.Kapitel !== null",
                          style="margin-left: 5px; margin-right: 5px"
                        )
                          q-input(
                            dense,
                            label="Vers von",
                            v-model.number="Textwort.Vers_von",
                            type="number"
                          )
                        .col-xs-12.col-sm-6.col-md-2(
                          style="margin-left: 5px; margin-right: 5px",
                          v-if="Textwort.Vers_von !== null"
                        )
                          q-input(
                            hint="Eingabe ist optional",
                            dense,
                            label="Vers bis",
                            v-model.number="Textwort.Vers_bis",
                            type="number"
                          )
          q-expansion-item(
            dense,
            dense-toggle,
            expand-separator,
            label="Personen",
            group="Inhalt",
            header-class="bg-primary text-white"
          )
            q-card
              q-card-section
                q-toolbar
                  q-btn.full-width(
                    dense,
                    icon="add",
                    unelevated,
                    @click="on_Neu('Person')"
                  )
              q-card-section
                q-list(bordered, separator)
                  q-item(v-for="(Person, PI) in Vorgabe.Personen", :key="PI")
                    q-item-section(avatar)
                      q-btn.full-height(
                        dense,
                        icon="delete",
                        unelevated,
                        @click="on_Loeschen('Person', PI)"
                      )
                    q-item-section
                      q-list(separator)
                        q-item
                          q-item-section
                            q-select(
                              dense,
                              v-model="Person.Name",
                              :options="$store.state.Personen.Personen",
                              label="Name"
                            )
          q-expansion-item(
            dense,
            dense-toggle,
            expand-separator,
            label="Lieder",
            group="Inhalt",
            header-class="bg-primary text-white"
          )
            q-card
              q-card-section
                q-toolbar
                  q-btn.full-width(
                    dense,
                    icon="add",
                    unelevated,
                    @click="on_Neu('Lied')"
                  )
              q-card-section
                q-list(bordered, separator)
                  q-item(v-for="(ELied, LI) in Vorgabe.Lieder", :key="LI")
                    q-item-section(avatar)
                      q-btn.full-height(
                        dense,
                        unelevated,
                        icon="delete",
                        @click="on_Loeschen('Lied', LI)"
                      )
                    q-item-section
                      .row
                        .col-xs-12.col-sm-6.col-md-2(
                          style="margin-left: 5px; margin-right: 5px"
                        )
                          q-input(
                            dense,
                            label="Bezeichnung",
                            v-model="ELied.Bezeichnung",
                            hint="z.B. Eingangslied oder 2. Abendmahlslied",
                            :rules="[(val) => val.length >= 3 || 'Bitte mindestens 3 Buchstaben eingeben']"
                          )
                        .col-xs-12.col-sm-6.col-md-2(
                          v-if="ELied.Bezeichnung.length >= 3",
                          style="margin-left: 5px; margin-right: 5px"
                        )
                          q-select(
                            dense,
                            label="Typ",
                            v-model="ELied.Typ",
                            :options="['Eingangslied', 'Bußlied', 'Abendmahlslied', 'Schlusslied', 'ohne']"
                          )
                        .col-xs-12.col-sm-6.col-md-2(
                          v-if="ELied.Typ !== null",
                          style="margin-left: 5px; margin-right: 5px"
                        )
                          q-input(
                            label="Nummer",
                            v-model="ELied.Nummer",
                            dense
                          )
                        .col-xs-12.col-sm-6.col-md-2(
                          v-if="ELied.Nummer !== null",
                          style="margin-left: 5px; margin-right: 5px"
                        )
                          q-input(
                            dense,
                            label="Strophen",
                            hint="Bitte mit einem Komma unterteilen! Sollen alle Strophen gewählt werden, einfach das Feld leer lassen",
                            v-model="ELied.Strophen"
                          )
</template>

<script>
/* eslint-disable no-case-declarations */
const lstrURL = "https://ugd.hh-sued.de/uebertragungen.php";
export default {
  components: {},
  name: "App",
  data: () => ({
    Dialog: false,
    DatumZeit: null,
    Bibel: {
      "1. Mose": 50,
      "2. Mose": 40,
      "3. Mose": 27,
      "4. Mose": 36,
      "5. Mose": 34,
      Josua: 24,
      Richter: 21,
      Rut: 4,
      "1. Samuel": 31,
      "2. Samuel": 24,
      "1. Könige": 22,
      "2. Könige": 25,
      "1. Chronik": 29,
      "2. Chronik": 36,
      Esra: 10,
      Nehemia: 13,
      Ester: 10,
      Hiob: 42,
      Psalm: 150,
      Sprüche: 31,
      Prediger: 12,
      Hohelied: 8,
      Jesaja: 66,
      Jeremia: 52,
      Klagelieder: 5,
      Hesekiel: 48,
      Daniel: 12,
      Hosea: 14,
      Joel: 4,
      Amos: 9,
      Obadja: 1,
      Jona: 4,
      Micha: 7,
      Nahum: 3,
      Habakuk: 3,
      Zefanja: 3,
      Haggai: 2,
      Sacharja: 14,
      Maleachi: 3,
      Matthäus: 28,
      Markus: 16,
      Lukas: 24,
      Johannes: 21,
      Apostelgeschichte: 28,
      Römer: 16,
      "1. Korinther": 16,
      "2. Korinther": 13,
      Galater: 6,
      Epheser: 6,
      Philipper: 4,
      Kolosser: 4,
      "1. Thessalonicher": 5,
      "2. Thessalonicher": 3,
      "1. Timotheus": 6,
      "2. Timotheus": 4,
      Titus: 3,
      Philemon: 1,
      Hebräer: 13,
      Jakobus: 5,
      "1. Petrus": 5,
      "2. Petrus": 3,
      "1. Johannes": 5,
      "2. Johannes": 1,
      "3. Johannes": 1,
      Judas: 1,
      Offenbarung: 22
    },
    AktiveVorgabe: "",
    Vorgaben: [],
    Vorgabe: null
  }),
  mounted() {
    this.$Log.Schreibe(
      "-------------------- Vorgabenverwaltung vom Benutzer gestartet"
    );
    this.$store.commit("Personen/laden");
    this.on_hole_Vorgaben();
  },
  methods: {
    ZweiStellen(Zahl) {
      const lstrZahl = Zahl.toString();
      return lstrZahl.length === 1 ? "0" + lstrZahl : lstrZahl;
    },
    on_Dialog() {
      const ldtJetzt = new Date();
      this.DatumZeit =
        this.ZweiStellen(ldtJetzt.getDate()) +
        "." +
        this.ZweiStellen(ldtJetzt.getMonth() + 1) +
        "." +
        ldtJetzt.getFullYear() +
        " " +
        this.ZweiStellen(ldtJetzt.getHours()) +
        ":" +
        this.ZweiStellen(ldtJetzt.getMinutes());
      this.Dialog = true;
    },
    on_speichern() {
      this.Vorgabe.Lieder.forEach(lobjLied => {
        if (lobjLied.Strophen === null) {
          lobjLied.Strophen = "";
        }
      });
      fetch(lstrURL + "?Aktion=speichern&Vorgabe=" + this.AktiveVorgabe, {
        method: "POST",
        mode: "same-origin",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.Vorgabe)
      });
      this.$q.notify("Daten zum Server geschickt und gespeichert!");
      this.$Log.Schreibe(
        "Die Daten einer Vorgabe wurden vom Benutzer gespeichert und vom System zum Server geschickt"
      );
    },
    async on_Vorgabe_gewaehlt() {
      const lobjResponse = await fetch(
        lstrURL + "?Aktion=Vorgabe&Vorgabe=" + this.AktiveVorgabe,
        {}
      );
      this.Vorgabe = await lobjResponse.json();
      this.$Log.Schreibe(
        "Vorgabe wurde vom Benutzer ausgewählt und die Daten geladen"
      );
    },
    async on_hole_Vorgaben() {
      const lobjResponse = await fetch(lstrURL + "?Aktion=Vorgaben", {});
      this.Vorgaben = await lobjResponse.json();
      this.$Log.Schreibe("Vorhandene Vorgaben wurden vom Server geladen");
    },
    on_Loeschen(Was, Index = null) {
      this.$q
        .dialog({
          title: "Wirklich löschen?",
          message: "Möchtest Du diesen Eintrag wirklich löschen?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          switch (Was) {
            case "Vorgabe":
              fetch(
                lstrURL + "?Aktion=loeschen&Vorgabe=" + this.AktiveVorgabe,
                {
                  method: "GET",
                  mode: "same-origin",
                  credentials: "same-origin",
                  headers: {
                    "Content-Type": "application/json"
                  }
                }
              );
              this.$q.notify("Daten zum Server geschickt und gelöscht!");
              this.Vorgabe = null;
              this.Vorgaben = [];
              this.AktiveVorgabe = null;
              this.$Log.Schreibe("Vorgabe wurde vom Benutzer gelöscht");
              this.on_hole_Vorgaben();
              break;
            case "Person":
              this.Vorgabe.Personen.splice(Index, 1);
              this.$Log.Schreibe("Person wurde vom Benutzer gelöscht");
              break;
            case "Lied":
              this.Vorgabe.Lieder.splice(Index, 1);
              this.$Log.Schreibe("Lied wurde vom Benutzer gelöscht");
              break;
            case "Textwort":
              this.Vorgabe.Textworte.splice(Index, 1);
              this.$Log.Schreibe("Textwort wurde vom Benutzer gelöscht");
              break;
          }
        });
    },
    async on_Neu(Was, Vorgabe = null) {
      switch (Was) {
        case "Vorgabe":
          const lobjVorgabe = {
            Wann: this.DatumZeit,
            Startbildschirm: {
              Art: "Gottesdienst",
              Datum: true,
              Startuhrzeit: "10:00",
              Startzeit: true,
              Hinweis: false,
              Hinweistext: ""
            },
            Allgemein: {
              Hinweis: false,
              Hinweistext: ""
            },
            Textworte: [],
            Personen: [],
            Endbildschirm: {
              Hinweis_Ende: false,
              Hinweis_Ende_Text: ""
            },
            Lieder: []
          };
          this.AktiveVorgabe = this.DatumZeit;
          this.Vorgabe = lobjVorgabe;
          this.Dialog = false;

          this.$q.notify("Daten zum Server geschickt und gespeichert!");
          this.$Log.Schreibe(
            "Neue Vorgabe vom Benutzer erzeugt und auf dem Server gespeichert!"
          );
          break;
        case "Person":
          this.Vorgabe.Personen.push({
            Name: "Nachname, Vorname"
          });
          this.$Log.Schreibe("Neue Person vom Benutzer erzeugt");
          break;
        case "Lied":
          this.Vorgabe.Lieder.push({
            Bezeichnung: "",
            Typ: null,
            Nummer: null,
            Strophen: null
          });
          this.$Log.Schreibe("Neues Lied vom Benutzer erzeugt");
          break;
        case "Textwort":
          this.Vorgabe.Textworte.push({
            Bezeichnung: "",
            Buch: null,
            Kapitel: null,
            Vers_von: null,
            Vers_bis: null
          });
          this.$Log.Schreibe("Neues Textwort vom Benutzer erzeugt");
          break;
      }
    }
  }
};
</script>
