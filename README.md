# REST API zur verwaltung einer Bibliothek

**Entitäten:**

* Bücher
* Verfasser
* Kategorien

## Bücher

* GET /bücher: Gibt eine Liste aller Bücher zurück.
* POST /bücher: Fügt ein neues Buch hinzu.
* GET /bücher/{buch_id}: Gibt Details zu einem bestimmten Buch zurück.
* PUT /bücher/{buch_id}: Aktualisiert ein bestimmtes Buch.
* DELETE /bücher/{buch_id}: Löscht ein spezifisches Buch.

## Verfasser

* GET /verfasser: Gibt eine Liste aller Verfasser zurück.
* POST /verfasser: Fügt einen neuen Verfasser hinzu.
* GET /verfasser/{verfasser_id}: Gibt Details zu einem bestimmten Verfasser zurück.
* PUT /verfasser/{verfasser_id}: Aktualisiert einen bestimmten Verfasser.
* DELETE /verfasser/{verfasser_id}: Löscht einen spezifischen Verfasser.

## Kategorien

* GET /kategorien: Gibt eine Liste aller Kategorien zurück.
* POST /kategorien: Fügt eine neue Kategorie hinzu.
* GET /kategorien/{kategorie_id}: Gibt Details zu einer bestimmten Kategorie zurück.
* PUT /kategorien/{kategorie_id}: Aktualisiert eine spezifische Kategorie.
* DELETE /kategorien/{kategorie_id}: Löscht eine spezifische Kategorie.
