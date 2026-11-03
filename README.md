# Umwelt-Log (früher „Uferlog“ / „Seekoje“)

## Bedienung in Kürze
- **Unten auf der Karte:** orangener Knopf **＋ Messpunkt hier** setzt einen Messpunkt an der GPS-Position (ohne GPS: Kartenmitte). **📍 Auf Karte antippen** setzt ihn an eine beliebige Stelle, **🌳 Baum** erfasst einen Baum.
- **Tab „Messpunkte“** (rechts, am Handy unten): alle eigenen Messpunkte, Messstellen und Bäume in einer eigenen Liste, neueste zuerst. Antippen springt zum Punkt und öffnet die Eingabe. Dort auch CSV-Export.
- **Pins:** Messpunkte erscheinen als große orange Pins mit Wassertemperatur-Beschriftung, Messstellen gelb, Bäume grün.
- **Tab „Zeichnen“:** Werkzeuge und Objekte (Gewässer, Stege, Tonnen …). Diese Liste enthält keine Messpunkte mehr. Während des Zeichnens beendet der Knopf **✓ Fertig** oben den Modus.
- **Tab „Daten“:** Tiefen, Profile, Höhenmodelle, Umgebung. **Tab „Projekt“:** Speichern, Laden, Export, Quellen.

---

# Technische Details (Stand Uferlog)

Webapp (PWA) zum Kartieren, Messen und Exportieren von Gewässerdaten (Open-Data-GIS). Keine Navigationssoftware. Alle Dateien liegen im Hauptverzeichnis, keine Unterordner.

## Auf GitHub Pages veröffentlichen
1. Neues Repository anlegen (z. B. `umwelt-log`), alle Dateien dieses Ordners hochladen (Add file → Upload files).
2. Settings → Pages → Branch `main`, Ordner `/ (root)` → Save.
3. Nach ca. 1 Minute: `https://<name>.github.io/umwelt-log/`. Auf dem Handy „Zur Startseite hinzufügen“ bzw. „App installieren“.

Lokal testen: `python3 -m http.server 8080` im Ordner, dann http://localhost:8080.

## Dateien
`index.html`, `fauna.js` (Tier-Katalog), (enthält CSS, Code und Konfiguration; GeoSN-Einstellungen oben im Block `window.CFG`, es gibt keine separate config.js), `manifest.webmanifest`, `sw.js`, Icons (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`).

## Datenprüfung
**Daten prüfen** (Panel „Umgebung & Gelände“) meldet fehlendes Gewässer, geschätzte Platzhalter, sich selbst schneidende Ufer, kleine Inseln, Tonnen an Land, fehlenden Wasserspiegel, fehlende Umgebung/Höhen/Tiefen sowie Modellschätzungen. Overpass-Abrufe fallen bei Überlast (429/504) automatisch auf Ausweichserver zurück (`CFG.overpassAlt`).

## Neues Projekt & Autosave
- **＋ Neu** (Leiste) bzw. **＋ Neues Projekt** (Panel „Projekt“): Name eingeben, Ort per Namenssuche (OSM-Nominatim, nur auf Knopfdruck/Enter) oder als „Breite, Länge“ (z. B. `51.27, 12.33`) wählen, oder „Aktuellen Kartenausschnitt nehmen“. Das alte Projekt kann vorher als JSON gesichert werden (Haken ist voreingestellt). Danach ist „💧 See wählen“ aktiv: auf die Wasserfläche tippen.
- Der Projektname steht in der Leiste, im Seitentitel und in den Dateinamen der Exporte.
- **Projektdatei (Schema 2):** „Projekt speichern“ bzw. „Speichern unter …“ schreibt EINE JSON-Datei mit allen Objekten, Messpunkten, Messstellen, Pflanzen/Bäumen, Tiefenpunkten (vollständig), Umgebung, Höhenraster, Quellen und Zählern zur Kontrolle. „Projekt laden“ prüft die Datei vorab, lädt alles-oder-nichts (bei Fehler bleibt der alte Stand) und meldet fehlende Teile. Ältere Dateien (ohne Schema) werden weiter geladen.
- **Sichtungen (Fauna):** Knopf „🦋 Sichtung erfassen“ (Tab Messpunkte bzw. ⋯ Mehr auf der Karte). Unten öffnet sich ein Erfassungsblatt: Artgruppe (Insekten & Wasserwirbellose, Amphibien, Fische, Vögel, Säuger/Sonstige) → Art per Schnellwahl, „Zuletzt“ oder Freitext → Anzahl (± oder Häufigkeitsklasse) → Stadium → Lebensraum. „＋ Weitere hier“ legt mehrere Arten an derselben Probestelle an (gemeinsame `sample_id`). Pin-Icon und Farbe je Artgruppe. Zeigerarten tragen einen vereinfachten Saprobien-Zeigerwert (`sap`, 🟢🟡🟠🔴): nur Orientierung im Feld, keine amtliche Gewässergütebewertung. Der Katalog liegt in `fauna.js` (reine Daten, dort erweiterbar). Export: „Sichtungen CSV“, Projektdatei/GeoJSON enthalten alle Felder.
- **Fotos:** Im Objekt-Panel jedes Messpunkts/Baums/Strauchs/Wasserpflanze: „📷 Aufnehmen“ bzw. „🖼 Auswählen“. Bilder werden auf max. 1280 px (JPEG, ca. 150–300 KB) verkleinert und lokal im Browser (IndexedDB, Store `photos`) abgelegt; am Objekt steht nur `properties.photos` (Verweise: id, w, h, t, kb). „Fotos in Projektdatei einbeziehen“ (Panel Projekt) packt sie als Block `photos` in die Projektdatei. GeoJSON/GPX/CSV enthalten nur die Verweise. Fotos ohne Verweis werden beim Start/Laden aufgeräumt.
- **Autosave:** Der letzte Stand wird automatisch im Browser (IndexedDB) abgelegt und beim nächsten Start wiederhergestellt. Das ist ein Sicherheitsnetz, kein Archiv: wichtige Stände weiterhin mit „Speichern (JSON)“ sichern. Autosave gilt pro Browser/Gerät.
- Die geschätzte Cospudener-Ellipse erscheint nur noch beim allerersten Start.

## Vor-Ort-Erfassung (Messpunkte & Bäume)
Tab „Messpunkte“ bzw. Schnellknöpfe auf der Karte: **💧 Messpunkt hier** / **📍 Auf Karte antippen** / **🌳 Baum hier** setzt einen Punkt an der GPS-Position (Zeitstempel und Genauigkeit werden gespeichert; ohne GPS Kartenmitte). Danach Werte im Objekt-Panel eintragen.
- **Messpunkt:** `water_temp_c`, `secchi_m`, `ph`, `merkmal` (Krautbank, Schilf, Müll/Treibgut, Laichzone, Blaualgen), Notiz. Beim Erfassen wird automatisch das aktuelle Wetter von Open-Meteo dazugespeichert (`air_temp_c`, `wind_ms`, `wind_dir_deg`, `cloud_pct`, `precip_mm`, `weather_time`; Modellwerte, keine Messung am See, CC BY 4.0, nur nicht-kommerziell). Ohne Netz: im Objekt-Panel „Wetter abrufen“ nachholen.
- **Baum:** `species`, `taxon`, `circumference_cm` (Stamm in 1,3 m Höhe), `height`, `crown_m`, `zustand`, `start_year`, `standort`. Namen sind an die OSM-Tags `natural=tree` angelehnt (`species`, `taxon`, `circumference`, `height`, `diameter_crown`, `start_date`).
- **Export:** GeoJSON (alle Objekte) sowie „Messpunkte CSV“ und „Bäume CSV“ (Semikolon, UTF-8 mit BOM, WGS84).

### Feste Messstellen
Im Tab „Messpunkte“ unter „Feste Messstelle anlegen“ gibt es zwei Vorlagen (**Leipziger Seesportclub e.V.**, **Kleine Brücke Karl-Heine-Kanal / Lindenauer Hafen**) und „Eigene Stelle …“. Die genauen Koordinaten sind bewusst nicht hinterlegt: vor Ort „Stelle hier setzen (GPS)“ oder die Karte auf die Stelle schieben und „in Kartenmitte“. Am gelben Punkt legt „Messung an dieser Stelle“ einen Messpunkt exakt an der Stelle an (Feld `station`) und zeigt die letzten Messungen. Einzelne Messpunkte im Umkreis von 30 m werden automatisch der Stelle zugeordnet.

**Secchi-Sichttiefe:** Gerät ist die Secchi-Scheibe (Sichtscheibe), für Binnenseen üblich mit Ø 20 cm, an Leine mit Marke alle 10 cm. Im Feld `secchi_disk` wird das verwendete Gerät festgehalten, damit Messreihen vergleichbar bleiben.

**Daten weitergeben:** Die App sendet nichts automatisch. Exporte (CSV/GeoJSON) kannst du an Projekte auf mit:forschen! (https://www.mitforschen.org) geben, selbst veröffentlichen (z. B. Zenodo/GitHub) oder Behörden als ergänzende, nicht akkreditierte Beobachtung mitteilen.

### Referenz: Baumkataster Leipzig
„Baumkataster laden“ holt ab Zoom 16 die Bäume im Kartenausschnitt aus dem ArcGIS-Feature-Service der Stadt Leipzig (Layer `Baum_Leipzig`, GeoJSON, max. 2000 pro Abruf, Stand 11.2023, Erfassung unvollständig). Eigene Bäume im Umkreis von 8 m färben den Katasterpunkt grau. Tippen auf einen Punkt zeigt Art, Pflanzjahr und Maße; „Als eigenen Baum übernehmen“ legt einen Baum-Punkt mit Art, botanischem Namen, Pflanzjahr und Katasternummer an. Die Referenzebene wird nicht im Projekt gespeichert. Quelle: Stadt Leipzig, Open Data Leipzig (https://opendata.leipzig.de/dataset/baumkataster-stadt-leipzig1); Lizenzbedingungen dort prüfen.

## Tiefenschätzung
Panel „Messdaten & Profil“ → **Tiefe aus Ufer-Abstand schätzen**: Tiefe = Abstand zum Ufer × Neigung (Standard 12 %), begrenzt auf die Maximaltiefe (Standard 8 m), im Raster (Standard 25 m, bei großen Seen automatisch gröber). Inseln zählen als Ufer. Gedacht für Seen ohne Lotungen; alles ist als „Modellschätzung – KEINE Messung“ gekennzeichnet (Projekt, Export: `depthEstimated`, `depthSource`, Datenprüfung). Tiefenlinien mit Tiefenwert haben Vorrang (Schätzpunkte im Umkreis von 40 m werden ausgelassen). Vorhandene Lotungen werden nur nach Rückfrage ersetzt.

## Rechtliche Namensnennung & Revierkarte
- Panel **„Quellen & Lizenzen (Namensnennung)“** zeigt automatisch die für dieses Projekt nötigen Nennungen (OSM/ODbL, OpenSeaMap-Seezeichen, Copernicus DEM via Open-Meteo; Höhenquellen aus Dateien nur als Hinweis). Eigene Zeilen unter „Weitere Quellen“ (im Projekt gespeichert).
- **Namensnennung .txt** liefert den fertigen Credits-Text plus Hinweise zu ODbL (Produced Work vs. abgeleitete Datenbank) und Open-Meteo (nur nicht-kommerziell). Keine Rechtsberatung.
- Alle Exporte tragen die Nennung: Projekt-JSON, Objekte-/Umgebungs-GeoJSON (`attribution`, `license_note`), GPX (`<metadata><copyright>`).
- **Revierkarte .png** zeichnet Gewässer, Umgebung (falls geladen), Objekte, Tonnen, Maßstab und Nordpfeil; die Namensnennung steht in der Fußzeile des Bildes.

## Daten & Lizenz
- Karte: OpenStreetMap (ODbL), Seezeichen: OpenSeaMap. Die OSM-Standardkacheln sind nur für leichte Nutzung gedacht ([Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)); für viel Verkehr eigenen Kachelserver in `window.CFG.tiles` (index.html) eintragen.
- „OSM-Daten für Ausschnitt laden“ nutzt Overpass (ab Zoom 14), nur lesbar.
- GeoSN-Luftbild/Gelände: WMS-URL, Layer und Lizenz selbst in `window.CFG.geosn` (index.html) eintragen; leer = deaktiviert.
- LMBV-Tiefenkarte (04/2018): nicht eingebunden, nur visuelle Referenz.
- Startgewässer ist eine **geschätzte Ellipse** (Mittelpunkt Wikipedia, Fläche 4,36 km²), kein echter Uferverlauf: mit „OSM laden“ als Vorlage nachzeichnen.
- Keine API-Schlüssel im Frontend. Bibliotheken: Leaflet (BSD-2), Leaflet-Geoman (MIT), proj4js (MIT).

## Formate
Projekt-JSON, GeoJSON (EPSG:4326), GPX (Wegpunkte, Routen). Messungen in EPSG:25833.

## Messdaten & Profile
- **Tiefenlinien**: Typ „Tiefenlinie“ zeichnen (z. B. nach dem LMBV-Bild, Stand 04/2018) und im Panel die Tiefe in m eintragen. Ohne Tiefenwert wird die Linie ignoriert.
- **CSV/XYZ laden**: Art „Tiefe“ (Lotungen) oder „Höhe“ (z. B. GeoSN-DGM als XYZ). Spalten: WGS84 Breite;Länge;Wert oder UTM33 E;N;Wert (Zonenpräfix 33 wird erkannt). Kopfzeile mit lat/lon/tiefe/x/y/z wird erkannt. Höhen werden auf 10-m-Zellen ausgedünnt (max. 400 000). GeoTIFF wird nicht gelesen: vorher z. B. mit QGIS/GDAL in XYZ-Text umwandeln.
- **Profil (Schnitt)**: Typ „Profil“ zeichnen → Diagramme Höhe und Tiefe, CSV-Export. Werte nur dort, wo Daten vorliegen; Tiefen sind interpoliert und geschätzt. Wasserspiegel nicht vorbelegt (leer lassen, wenn unbekannt).

## Automatische Umrandung
Flächen mit gesetztem „Uferlinie auto“ (bei Typ „Gewässer“ standardmäßig an) bekommen eine abgeleitete Uferlinie, die bei Verschieben, Bearbeiten, Drehen und Skalieren nachgeführt wird (nach dem Loslassen).

## Gewässer aus OSM übernehmen
„💧 See wählen“ antippen, dann auf eine Wasserfläche tippen: Der Editor fragt per Overpass die OSM-Wasserfläche an dieser Stelle ab (auch Seen mit Inseln), zeigt sie gelb an und übernimmt sie nach Bestätigung als Gewässer mit automatischer Uferlinie und Infos (Name, OSM-ID, Tags, Fläche, Abrufdatum, Lizenz). Grundlage sind OSM-Vektordaten, keine Farberkennung der Karte; ist ein Gewässer in OSM nicht erfasst, wird nichts gefunden.

## Tonnen
Typ „Boje / Tonne“ setzen; im Panel Form (Tonne, Spitz-, Kugel-, Säulen-, Spieren-, Fasstonne, Raute, Quadrat), Größe und Farbe (Schnellwahl oder freie Farbe) wählen. „Tonnen übernehmen“ lädt vorhandene OSM/OpenSeaMap-Seezeichen im Kartenausschnitt (ab Zoom 13) als Objekte mit Name, Farbe, Form und OSM-Tags; bereits übernommene werden übersprungen.

## Import
Der Import-Button liest GeoJSON, GPX (Wegpunkte, Routen, Tracks) und KML (Punkt, Linie, Fläche). OSM-XML (.osm) wird nicht gelesen; dafür „OSM-Daten für Ausschnitt laden“ bzw. „See wählen“ nutzen.

## Wasserspiegel aus OSM
Hat ein übernommenes Gewässer den OSM-Tag `ele`, bietet der Editor an, ihn als Wasserspiegel für Profile zu setzen (auch nachträglich per Button im Eigenschaftenpanel). Der Wert ist eine ungeprüfte OSM-Angabe.

## Umgebung (1 km) & Höhenraster
1. See übernehmen („💧 See wählen“), dann **„Umgebung 1 km laden (OSM)“**: lädt ein Rechteck mit 1 km Rand um den Seeumriss (max. 40 km²). Jedes Objekt bekommt eine Klasse (`water, waterway, forest, scrub, grass, farmland, wetland, beach, urban, building, road, path, rail, harbor, tree, other`) plus die OSM-Tags. Wird im Projekt-JSON mitgespeichert.
2. **Höhen genau:** GeoSN-DGM1 (1 m, XYZ-Textdateien, ETRS89/UTM33) aus dem Sächsischen „Portal Offene Geodaten“ laden (Kacheln 2×2 km; für See + 1 km meist mehrere). Im Editor unter „Messdaten“: Art „Höhe“, Koordinaten „UTM33“, Rasterweite wählen, Dateien auswählen (mehrere möglich). Große Dateien werden gestreamt und in das Raster gemittelt, nur der Gebietsausschnitt bleibt im Speicher.
3. **Höhen grob (Vorschau):** „Höhen grob laden (90 m)“ ruft Copernicus DEM GLO-90 über Open-Meteo ab (CC BY 4.0, kostenlos nur nicht-kommerziell, Namensnennung nötig; Oberflächenmodell, für Ufergestaltung zu grob).
4. **Export:** „Umgebung GeoJSON“ (WGS84) und „Höhen .asc“ (ESRI-ASCII-Grid, EPSG:25833, Norden oben, Höhen in m ü. NHN; direkt in QGIS/GDAL ladbar).
Hinweise: Höhenraster werden als Uint16 (5-cm-Stufen) im Projekt gespeichert. Das DGM1 ist ein Geländemodell ohne Gebäude/Bäume; die Seetiefe ist darin nicht enthalten.

## Hinweis zum Öffnen
Die App muss über https (GitHub Pages) oder als installierte PWA laufen. Aus dem Dateimanager (`content://`/`file://`) lassen sich `fauna.js` und der Service Worker nicht laden. Cache-Version: umwelt-log-v11 (`sw.js` cached Hülle, Bibliotheken von unpkg und OSM-Kacheln, max. 600; Overpass nie).

## Probenauswertung (Schritt A1)
Im Objekt-Panel einer Sichtung mit `sample_id`: vereinfachter Saprobienindex SI = Σ(sap·h)/Σh, Häufigkeitsgewicht h: 1→1, 2–5→3, 6–20→5, 21–100→7, >100→9; kein Indikatorgewicht; Imagines ohne Zeigerwert. Hinweis bei <3 Zeigertaxa bzw. <10 Individuen. Nur Feldorientierung, keine amtliche Gewässergüte.

## Liste „Proben“ (Schritt A2)
Im Tab „Messpunkte“ gruppiert die Liste „Proben“ Sichtungen nach `sample_id` (Station/Datum, Anzahl Sichtungen, Taxa, SI mit Güteklasse und Hinweisen). Tippen springt zur ersten Sichtung der Probe.

## Amphibien-Auswertung (Schritt A3)
Pro Probe (`sample_id`) als Habitat-Zeiger: Artenzahl, Stadien, Lebensraum (Wasser: Freiwasser/Röhricht/Wasserpflanzen/Totholz/Steine/Schlamm; Land: Ufergehölz/Wiese; Uferzone separat), Fortpflanzungshinweis bei Laich/Larven/Rufen/Laichen. Kein Saprobienwert, keine Schutzstatus-Angabe.

## Sichtungs-Filter (Schritt B1)
Tab „Messpunkte“: Filter nach Artgruppe, Zeitraum (von/bis, lokales Datum) und „nur Zeigerarten“. Wirkt auf Liste „Sichtungen“/„Proben“ und blendet Pins auf der Karte aus; Daten und Export bleiben unverändert. Probenauswertung (SI) nutzt weiterhin alle Sichtungen der Probe. Filterstand wird lokal gemerkt.

## Parameter-Ansicht (Schritt B2)
Tab „Messpunkte“ → „Parameter-Ansicht“: färbt Messpunkte auf der Karte nach Wassertemperatur oder Secchi-Tiefe (Farbskala je Auswahl min–max). Saisonfilter: Ganzjahr, Frühling, Sommer, Herbst, Winter (nach Messdatum). Reine Anzeige (Kreise unter den Pins), keine Interpolation, nicht im Projekt gespeichert; Einstellung wird lokal gemerkt.

## Wetter pro Probe (Schritt C)
Ein Open-Meteo-Abruf je `sample_id` (automatisch beim Speichern der ersten Sichtung einer Probe, wenn online; weitere Sichtungen derselben Probe übernehmen die Werte). Manuell im Objekt-Panel der Sichtung. Bis 2 h nach Erfassung aktueller Modellwert, danach stündlicher Rückblick (bis 90 Tage). Modellwert (ca. 1–10 km Raster), keine Messung am See. Neue CSV-Spalten bei Sichtungen: air_temp_c, wind_ms, wind_dir_deg, cloud_pct, precip_mm, weather_time.

## Darwin-Core-Export (Schritt D2)
Daten → „Darwin Core CSV“: Occurrence-CSV der Sichtungen (Komma, UTF-8, ohne BOM; in deutschem Excel ggf. über „Daten → Aus Text/CSV“ öffnen). Mapping: uid→occurrenceID, sample_id→eventID, observed_at→eventDate, Lage→decimalLatitude/Longitude (WGS84), accuracy_m→coordinateUncertaintyInMeters, taxon→scientificName (leer, wenn kein wiss. Name), species→vernacularName, count→individualCount, Häufigkeitsklasse→organismQuantity (nur ohne Anzahl), stage→lifeStage, behavior→behavior, habitat→habitat, method→samplingProtocol, determination→identificationVerificationStatus, station→locationID, notes→occurrenceRemarks. Saprobien-Zeigerwert und Wetter (Open-Meteo, Modellwert) stehen als JSON in dynamicProperties. Jede Sichtung erhält eine stabile `uid` (auch in CSV/GeoJSON/Projekt). Lizenz (CC0/CC BY/CC BY-NC) wird je Projekt gespeichert; Beobachtername nur lokal im Browser (localStorage), nie in der Projektdatei. Nicht gegen GBIF o. ä. validiert.

## SensorThings-Export (Schritt D3)
Daten → „SensorThings JSON ⤓“: Messpunkte gruppiert nach Messstelle → je ein Thing (Deep-Insert-Struktur) mit Location, Datastreams (Wassertemperatur, Secchi, pH sowie Wetter-Modellwerte aus Open-Meteo) und Observations inkl. FeatureOfInterest (Punkt). Wetterwerte laufen über einen eigenen Sensor „Open-Meteo Modell“ (keine Messung am See; CC BY 4.0). `ObservedProperty.definition` ist bewusst leer (keine erfundenen URIs). Einheiten UCUM-Codes. Nicht gegen eine SensorThings-Instanz getestet. Nicht enthalten: Merkmal, Notizen, Fotos.

## Speicherstatus & Foto-Limits (Schritt E1)
Projekt → „Speicher prüfen“: Fotoanzahl/-größe im Projekt sowie App-Speicher laut `navigator.storage.estimate()` (Schätzwert des Browsers) und Persistenz-Status; Warnung ab 80 %. Limits (Konstanten `PH_MAX_OBJ`=12 Fotos je Punkt, `PH_MAX_MB`=150 MB Fotos je Projekt) und Abbruch, wenn <30 MB Gerätespeicher frei bzw. IndexedDB „Quota exceeded“ meldet. Werte sind meine Standardannahmen, nicht an Geräten getestet.

## Marker-Clustering (Schritt E2)
Ab 60 sichtbaren Erfassungspunkten (nach Filter) und bis Zoom 17 werden dicht beieinander liegende Pins (56-px-Raster) zu Sammelmarken mit Anzahl zusammengefasst; Tippen zoomt hinein. Gewählte Punkte bleiben einzeln. Reine Anzeige, Daten unverändert; ohne externe Bibliothek (offline). Schwellen: Konstanten `CL_MIN`, `CL_PX`, `CL_ZMAX`. Nur Logik getestet, nicht mit echten Datenmengen auf dem Handy.

## Gewässernetz Sachsen (Etappe 1)
Panel „Gewässernetz Sachsen (offline)“: lädt Flüsse und Kanäle (optional Bäche) aus OSM in Kacheln à 0,4° × 0,25° (ca. 28 × 28 km) und speichert sie in IndexedDB (Store `net`, DB-Version 3). Vor dem Start steht eine grobe Datenschätzung (nicht gemessen), danach der tatsächliche Verbrauch. Stopp per erneutem Tippen; fertige Kacheln bleiben. Anzeige als Linien (Bäche ab Zoom 12), Name per Tooltip. Nur Logik geprüft, nicht mit echtem Download getestet. Nächste Etappen: Projektionswahl (UTM32/33), weitere Bundesländer, Küste/Nord- und Ostsee.

## Bäume Sachsen (Etappe 1b)
Knopf „🌳 Bäume Sachsen laden (OSM)“: OSM-Knoten `natural=tree` in 208 Kacheln (0,2° × 0,125°), gespeichert mit Art, Umfang, Höhe, Pflanzjahr (soweit in OSM vorhanden; lückenhaft, kein Kataster). Anzeige ab Zoom 15, max. 4000 Punkte im Ausschnitt. Datenmenge unbekannt: nach 5 Kacheln erscheint eine Hochrechnung. Städtische Kataster (z. B. Leipzig) bleiben separat. Nur Logik geprüft, nicht mit echtem Download getestet.

## Mit dem Gewässernetz arbeiten
Tab „Daten“ → „Gewässernetz Sachsen (offline)“. Erst „Sachsen laden“ (am besten im WLAN), danach liegen die Linien offline im Browser. Enthalten: OSM-Linien `waterway=river|canal` (optional `stream`) mit Name, aber ohne Breite, Tiefe, Fließrichtung oder Wasserqualität; keine Seen/Flächen, keine Gräben. Bäume: nur Punkte aus OSM mit Art, Umfang, Höhe, Pflanzjahr, soweit eingetragen. Das Netz ist eine Anzeigeebene mit Namens-Tooltip beim Antippen; es wird nicht in Projektdateien gespeichert und nicht mit exportiert. „Löschen“ entfernt Gewässer und Bäume.

## Pegel und Fließrichtung (Etappe 2a)
- Fließrichtung: Pfeile ab Zoom 13 auf Flüssen/Bächen, abgeleitet aus der OSM-Zeichenrichtung (OSM-Konvention: Linie läuft flussabwärts). Für Kanäle werden keine Pfeile gezeichnet, weil die Richtung dort nicht verlässlich ist; einzelne Linien können in OSM falsch herum liegen.
- Pegel: Knopf „📈 Pegel Sachsen (WSV)“ holt live Wasserstand (W) und Abfluss (Q) aller WSV-Pegel in Sachsen (PEGELONLINE, nur Bundeswasserstraßen, z. B. Elbe). Nicht gespeichert, braucht Internet. Landespegel (LfULG/LHWZ) sind noch nicht angebunden: dafür habe ich keine gesicherte, offene Schnittstelle gefunden.
