// Game Configuration
const CONFIG = {
    // Debug Settings
    SHOW_COLLISION_BOXES: true,  // Setze auf false um Collision-Boxen auszublenden

    // Damage Values
    DAMAGE: {
        // Character Damage
        CHARACTER_MELEE: 15,      // Nahkampf-Schaden
        CHARACTER_SPELL: 25,      // Zauber-Schaden

        // Enemy Contact Damage (nicht mehr verwendet - nur Pushback)
        GOBLIN_CONTACT: 0,        // Kein Schaden bei Kontakt
        FLYING_EYE_CONTACT: 0,    // Kein Schaden bei Kontakt
        ENDBOSS_CONTACT: 0,       // Kein Schaden bei Kontakt

        // Enemy Attack Damage
        GOBLIN_ATTACK: 12,        // Goblin Attack-Schaden
        FLYING_EYE_ATTACK: 10,    // Flying Eye Attack-Schaden
        ENDBOSS_ATTACK2: 25,      // Endboss Attack2-Schaden
        ENDBOSS_ATTACK3: 35       // Endboss Attack3-Schaden
    }
};
