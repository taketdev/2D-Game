# Return of the Wizard - Refactoring Notes

## Todo-Liste

### ✅ Erledigt
1. Ordnerstruktur des Projekts analysieren und verbessern
2. Index.html an neue Ordnerstruktur anpassen
3. Funktionen mit 14+ Zeilen analysieren und auflisten
4. REFACTORING: Alle Funktionen 85-20 Zeilen (42 Funktionen)
5. REFACTORING: Verbleibende Funktionen 19-14 Zeilen (10 Funktionen)
6. Projektil-Bug fixen (cleanupProjectiles() Namenskonflikt behoben)

### ⏳ In Arbeit
- Keine aktuellen Tasks

### 📋 Noch offen
7. Verbleibende Funktionen mit 14+ Zeilen refaktorieren (80 Funktionen)
8. JS Doc Kommentare zu allen Funktionen und Klassen hinzufügen
9. Unnötige Kommentare aus dem Code entfernen
10. Dateien aufteilen, sodass keine Datei mehr als 400 Zeilen hat

---

## Funktionen mit 14+ Zeilen (Stand: Aktuell)

### 🔴 Kritisch (50+ Zeilen)
- **levels/level1.js:1** - createBackgroundObjects() (50 Zeilen)

### 🟠 Hoch (30-49 Zeilen)
- **js/menu.js:7** - constructor() (52 Zeilen)
- **js/menu.js:233** - drawEndGameMenu() (42 Zeilen)
- **levels/level1.js:111** - createLevel1() (34 Zeilen)
- **js/menu.js:561** - handleMainMenuClick() (33 Zeilen)
- **js/menu.js:1060** - handleTouchMainMenuClick() (33 Zeilen)

### 🟡 Mittel (20-29 Zeilen)
- **models/world.class.js:235** - draw() (65 Zeilen) ⚠️ SEHR GROSS
- **js/menu.js:359** - drawControlsText() (29 Zeilen)
- **js/menu.js:491** - handleMouseMove() (27 Zeilen)
- **models/hud/healthbar.class.js:14** - draw() (27 Zeilen)
- **models/hud/bosshealthbar.class.js:16** - draw() (26 Zeilen)
- **models/character/projectile.class.js:96** - drawProjectileSprite() (26 Zeilen)
- **js/game.js:137** - switch() (26 Zeilen)
- **js/game.js:169** - switch() (26 Zeilen)
- **js/touch-controls.js:202** - draw() (25 Zeilen)
- **models/character/character.class.js:499** - handleMovementInput() (25 Zeilen)
- **models/enemies/mushroom.class.js:95** - constructor() (24 Zeilen)
- **models/enemies/skeleton.class.js:95** - constructor() (24 Zeilen)
- **models/character/character.class.js:313** - drawSprite() (24 Zeilen)
- **models/world.class.js:130** - updateEnemyDirections() (24 Zeilen)
- **models/character/projectile.class.js:28** - constructor() (23 Zeilen)
- **models/hud/manabar.class.js:6** - draw() (22 Zeilen)
- **js/menu.js:629** - handlePauseClick() (22 Zeilen)
- **models/character/character.class.js:267** - updateAttack1Animation() (22 Zeilen)
- **models/character/character.class.js:290** - updateAttack2Animation() (22 Zeilen)
- **levels/level1.js:88** - createCloudAt() (21 Zeilen)
- **models/enemies/goblin.class.js:99** - constructor() (21 Zeilen)
- **js/menu.js:97** - loadImageSet() (20 Zeilen)
- **js/menu.js:399** - drawButton() (20 Zeilen)
- **js/menu.js:778** - restartGame() (20 Zeilen)
- **models/character/character.class.js:545** - applyPushback() (20 Zeilen)
- **models/character/character.class.js:643** - spawnProjectile() (20 Zeilen)

### 🟢 Niedrig (14-19 Zeilen)
- **js/audio.js:27** - setupAudio() (19 Zeilen)
- **js/audio.js:7** - constructor() (16 Zeilen)
- **js/game.js:96** - initGame() (17 Zeilen)
- **js/game.js:117** - cleanup() (15 Zeilen)
- **js/menu.js:154** - drawCurrentMenu() (17 Zeilen)
- **js/menu.js:80** - getImagePaths() (16 Zeilen)
- **js/menu.js:738** - showGameOver() (16 Zeilen)
- **js/menu.js:758** - showVictory() (16 Zeilen)
- **js/menu.js:196** - drawMainMenuButtons() (15 Zeilen)
- **js/menu.js:545** - handleDialogClick() (15 Zeilen)
- **js/menu.js:598** - handleSettingsClick() (15 Zeilen)
- **js/menu.js:802** - returnToMainMenu() (15 Zeilen)
- **js/menu.js:855** - drawPauseButtons() (15 Zeilen)
- **js/menu.js:921** - exitToMainMenu() (15 Zeilen)
- **js/menu.js:1044** - handleTouchDialogClick() (15 Zeilen)
- **js/menu.js:461** - handleMouseDown() (14 Zeilen)
- **js/touch-controls.js:130** - handleTouchEnd() (17 Zeilen)
- **js/touch-controls.js:20** - constructor() (16 Zeilen)
- **js/touch-controls.js:57** - calculateButtonPositions() (14 Zeilen)
- **js/touch-controls.js:231** - cleanup() (14 Zeilen)
- **models/character/character.class.js:481** - handleAttackInput() (17 Zeilen)
- **models/character/character.class.js:439** - die() (15 Zeilen)
- **models/character/character.class.js:579** - updateKnockback() (15 Zeilen)
- **models/character/character.class.js:665** - drawFrame() (15 Zeilen)
- **models/character/character.class.js:456** - cleanup() (14 Zeilen)
- **models/character/projectile.class.js:79** - move() (16 Zeilen)
- **models/character/projectile.class.js:138** - drawFrame() (14 Zeilen)
- **models/enemies/endboss.class.js:171** - moveTowardsTarget() (17 Zeilen)
- **models/enemies/endboss.class.js:516** - drawFrame() (15 Zeilen)
- **models/enemies/endboss.class.js:122** - updateAI() (14 Zeilen)
- **models/enemies/endboss.class.js:431** - animate() (14 Zeilen)
- **models/enemies/flying_eye.class.js:72** - constructor() (17 Zeilen)
- **models/enemies/flying_eye.class.js:313** - drawFrame() (15 Zeilen)
- **models/enemies/goblin.class.js:314** - handleAggroMovement() (19 Zeilen)
- **models/enemies/goblin.class.js:334** - handlePatrolMovement() (17 Zeilen)
- **models/enemies/goblin.class.js:436** - drawFrame() (15 Zeilen)
- **models/enemies/mushroom.class.js:313** - handleAggroMovement() (16 Zeilen)
- **models/enemies/mushroom.class.js:330** - handlePatrolMovement() (15 Zeilen)
- **models/enemies/mushroom.class.js:410** - drawFrame() (14 Zeilen)
- **models/enemies/skeleton.class.js:313** - handleAggroMovement() (16 Zeilen)
- **models/enemies/skeleton.class.js:330** - handlePatrolMovement() (15 Zeilen)
- **models/enemies/skeleton.class.js:410** - drawFrame() (14 Zeilen)
- **models/movable_object.class.js:24** - applyGravity() (15 Zeilen)
- **models/world.class.js:392** - addToMap() (15 Zeilen)
- **models/world.class.js:408** - drawEndboss() (15 Zeilen)
- **models/world.class.js:476** - drawGenericObject() (15 Zeilen)
- **models/world.class.js:100** - checkCollisions() (14 Zeilen)
- **models/world/scroll.class.js:24** - drawFrame() (15 Zeilen)

---

## Statistik

- **Gesamt**: 80 Funktionen mit 14+ Zeilen
- **Kritisch (50+)**: 1 Funktion
- **Hoch (30-49)**: 5 Funktionen
- **Mittel (20-29)**: 26 Funktionen
- **Niedrig (14-19)**: 48 Funktionen

---

## Große Dateien (>400 Zeilen)

- **js/menu.js**: 1093 Zeilen ⚠️
- **models/character/character.class.js**: 679 Zeilen ⚠️
- **models/world.class.js**: 582 Zeilen ⚠️
- **models/enemies/endboss.class.js**: 531 Zeilen ⚠️
- **models/enemies/goblin.class.js**: 451 Zeilen ⚠️
- **models/enemies/skeleton.class.js**: 424 Zeilen ⚠️
- **models/enemies/mushroom.class.js**: 424 Zeilen ⚠️

---

## Bekannte Bugs (Behoben)

### ✅ Projektil-Bewegung Bug (Behoben)
**Problem**: Projektile wurden erstellt, aber bewegten sich nicht (blieben an Spawn-Position stehen).

**Ursache**: Beim Refactoring wurden zwei Funktionen mit demselben Namen `cleanupProjectiles()` erstellt:
- Zeile 225: Filter-Funktion (sollte jedes Frame laufen)
- Zeile 534: Cleanup-Funktion mit `.cleanup()` Aufrufen (sollte nur bei Game Over laufen)

JavaScript hat die zweite Funktion überschrieben, sodass JEDES Frame (60x/Sekunde) `.cleanup()` auf allen Projektilen aufgerufen wurde und ihre Intervals sofort gelöscht wurden.

**Lösung**: Die zweite Funktion in `stopAllProjectiles()` umbenannt.
