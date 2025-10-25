# Mobile Touch Controls Implementation Plan

## Ziel
Das Spiel "Return of the Wizard" soll vollständig auf Mobile/Tablet spielbar werden mit Touch-Controls und optimiertem Fullscreen-Modus.

## Anforderungen

### 1. Portrait Mode Verhalten
- Website läuft normal im Portrait Mode
- Canvas zeigt Overlay-Message: "Tap to Play Game - Game requires landscape mode + fullscreen"
- Bei Tap auf Canvas → Fullscreen aktivieren

### 2. Landscape Mode + Fullscreen
- Canvas bleibt in Original-Größe (720x480) zentriert mit schwarzen Balken (KEIN Scaling)
- Touch-Controls werden auf dem Canvas gezeichnet
- Alle Website-Elemente (Header, Footer, Info-Panel) ausgeblendet

### 3. Portrait Mode in Fullscreen
- Spiel wird automatisch pausiert
- Warning-Overlay: "Please rotate your device to landscape mode!"
- Canvas mit reduzierter Opacity (0.2)

### 4. Touch Controls Layout

**Links unten:**
- D-Pad für Bewegung (Links/Rechts als zwei getrennte Buttons)
- Shift-Button (Sprint) direkt darüber

**Rechts unten (mit Abstand zum Pause-Button):**
- Jump-Button (Space) - am weitesten rechts
- Attack1-Button (D) - links vom Jump
- Attack2-Button (E) - links vom Attack1

**Design:**
- Semi-transparente Rechtecke/Kreise
- Einfache Icons/Text Labels
- Nur auf Mobile/Tablet sichtbar (nicht auf Desktop)

### 5. Menu Touch Support
- Alle bestehenden Menu-Buttons brauchen Touch-Events (touchstart, touchend, touchmove)
- Touch-Offset-Problem beheben (Canvas-Koordinaten korrekt berechnen)
- Betrifft: Play, Settings, Exit, Question, Close, Music Toggle, Resume Buttons

## Technische Umsetzung

### Neue Datei erstellen
- **`js/touch-controls.js`** - Komplett neue Datei für alle Touch-Control-Logik

### Datei-Struktur von `touch-controls.js`:
1. Mobile-Detection (Check ob Mobile/Tablet)
2. TouchControls Klasse mit:
   - Button-Definitionen (Position, Größe, Funktion)
   - Draw-Methode (zeichnet Buttons auf Canvas)
   - Touch-Event-Handler (touchstart, touchend, touchmove)
   - Verbindung zum bestehenden `keyboard` Objekt
3. Integration mit `world.class.js` zum Zeichnen der Controls

### Bestehende Dateien anpassen:

**`index.html`:**
- `<script src="./js/touch-controls.js"></script>` vor `</head>` einfügen

**`js/menu.js`:**
- Touch-Events zu allen Button-Handlern hinzufügen (touchstart, touchend, touchmove)
- Touch-Koordinaten korrekt berechnen (getBoundingClientRect berücksichtigen)

**`js/fullscreen.js`:**
- Portrait-in-Fullscreen Detection erweitern
- Bei Portrait-Mode in Fullscreen: `world.isPaused = true` setzen

**`models/world.class.js`:**
- In `drawHUD()` Methode: Touch-Controls zeichnen (falls Mobile)
- Touch-Controls nur zeichnen wenn: `!this.isPaused && isMobile`

## Wichtige Hinweise
- Touch-Controls nutzen das BESTEHENDE `keyboard` Objekt (setzen `keyboard.LEFT = true` etc.)
- KEIN localStorage/sessionStorage verwenden
- Touch-Buttons müssen mit `this.isPaused` Check pausierbar sein
- Canvas bleibt bei 720x480 (kein Scaling, nur zentriert mit schwarzen Balken)

## Test-Checklist
- [ ] Portrait Mode zeigt "Tap to Play" Overlay
- [ ] Landscape Mode aktiviert Fullscreen automatisch
- [ ] Touch-Controls erscheinen nur auf Mobile
- [ ] Alle Buttons funktionieren (Bewegung, Jump, Attack, Sprint)
- [ ] Menu-Buttons reagieren auf Touch
- [ ] Portrait in Fullscreen pausiert Spiel + zeigt Warning
- [ ] Pause-Button funktioniert mit Touch
- [ ] Zurück zu Landscape unpausiert automatisch