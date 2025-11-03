/**
 * Audio Manager for Game
 * Handles background music and sound effects with volume control
 */

class AudioManager {
    constructor() {
        this.volume = 0.45; // 45% Lautstärke
        this.musicEnabled = true;
        this.currentMusic = null;
        
        // Audio-Dateien laden
        this.audio = {
            menuMusic: new Audio('./assets/audio/16 - The Calm Before The Storm.wav'),
            gameMusic: new Audio('./assets/audio/05 - Battle 1.wav')
        };
        
        // Audio-Eigenschaften konfigurieren
        this.setupAudio();
        
        console.log('Audio Manager initialized');
    }
    
    /**
     * Audio-Eigenschaften konfigurieren
     */
    setupAudio() {
        Object.values(this.audio).forEach(audio => {
            audio.volume = this.volume;
            audio.loop = true;
            
            // Preload audio
            audio.preload = 'auto';
            
            // Error handling
            audio.addEventListener('error', (e) => {
                console.warn('Audio loading error:', e);
            });
            
            // Loaded event
            audio.addEventListener('loadeddata', () => {
                console.log('Audio loaded:', audio.src);
            });
        });
    }
    
    /**
     * Menu-Musik abspielen
     */
    playMenuMusic() {
        if (!this.musicEnabled) return;
        
        this.stopCurrentMusic();
        this.currentMusic = this.audio.menuMusic;
        
        // Play with user interaction handling
        this.playWithFallback(this.currentMusic);
    }
    
    /**
     * Game-Musik abspielen
     */
    playGameMusic() {
        if (!this.musicEnabled) return;
        
        this.stopCurrentMusic();
        this.currentMusic = this.audio.gameMusic;
        
        // Play with user interaction handling
        this.playWithFallback(this.currentMusic);
    }
    
    /**
     * Aktuelle Musik stoppen
     */
    stopCurrentMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
    }
    
    /**
     * Musik pausieren
     */
    pauseMusic() {
        if (this.currentMusic && !this.currentMusic.paused) {
            this.currentMusic.pause();
        }
    }
    
    /**
     * Musik fortsetzen
     */
    resumeMusic() {
        if (this.currentMusic && this.currentMusic.paused && this.musicEnabled) {
            this.playWithFallback(this.currentMusic);
        }
    }
    
    /**
     * Musik an/aus schalten
     */
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        
        if (this.musicEnabled) {
            this.resumeMusic();
        } else {
            this.pauseMusic();
        }
        
        console.log('Music', this.musicEnabled ? 'enabled' : 'disabled');
        return this.musicEnabled;
    }
    
    /**
     * Lautstärke setzen (0.0 - 1.0)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        Object.values(this.audio).forEach(audio => {
            audio.volume = this.volume;
        });
        
        console.log('Volume set to:', Math.round(this.volume * 100) + '%');
    }
    
    /**
     * Audio mit Fallback abspielen (für Browser-Autoplay-Policy)
     */
    playWithFallback(audio) {
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => this.logAudioPlaying(audio))
                .catch((error) => this.handleAutoplayPrevented(audio, error));
        }
    }

    logAudioPlaying(audio) {
        console.log('Audio playing:', audio.src.split('/').pop());
    }

    handleAutoplayPrevented(audio, error) {
        console.warn('Autoplay prevented - will play after user interaction:', error);
        this.setupPlayAfterInteraction(audio);
    }

    setupPlayAfterInteraction(audio) {
        const playAfterInteraction = () => {
            this.tryPlayAfterInteraction(audio, playAfterInteraction);
        };

        document.addEventListener('click', playAfterInteraction, { once: true });
        document.addEventListener('touchstart', playAfterInteraction, { once: true });
    }

    tryPlayAfterInteraction(audio, handler) {
        if (this.musicEnabled && this.currentMusic === audio) {
            audio.play().then(() => {
                console.log('Audio playing after user interaction:', audio.src.split('/').pop());
            });
        }
        document.removeEventListener('click', handler);
        document.removeEventListener('touchstart', handler);
    }
    
    /**
     * Cleanup
     */
    cleanup() {
        this.stopCurrentMusic();
        Object.values(this.audio).forEach(audio => {
            audio.src = '';
            audio.load();
        });
    }
}

// Global Audio Manager Instance
let audioManager = null;

// Initialize Audio Manager after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    audioManager = new AudioManager();
    
    // Make it globally available
    window.audioManager = audioManager;
});