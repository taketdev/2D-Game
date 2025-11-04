/**
 * Audio Manager for Game
 * Handles background music and sound effects with volume control
 */

class AudioManager {
    constructor() {
        this.volume = 0.45;
        this.musicEnabled = this.loadMusicState();
        this.currentMusic = null;
        this.debugMode = false;

        this.audio = {
            menuMusic: new Audio('./assets/audio/16 - The Calm Before The Storm.wav'),
            gameMusic: new Audio('./assets/audio/05 - Battle 1.wav')
        };

        this.setupAudio();
    }
    
    /**
     * Loads the music enabled state from localStorage
     * @function loadMusicState
     * @returns {boolean} The saved music state or true if no state is saved
     */
    loadMusicState() {
        const savedState = localStorage.getItem('musicEnabled');
        return savedState === null ? true : savedState === 'true';
    }

    /**
     * Saves the current music enabled state to localStorage
     * @function saveMusicState
     * @returns {void}
     */
    saveMusicState() {
        localStorage.setItem('musicEnabled', this.musicEnabled.toString());
    }

    /**
     * Configures audio properties for all audio files including volume, loop settings and event handlers
     * @function setupAudio
     * @returns {void}
     */
    setupAudio() {
        Object.values(this.audio).forEach(audio => {
            audio.volume = this.volume;
            audio.loop = true;

            audio.preload = 'auto';

            audio.addEventListener('error', (e) => {
                console.warn('Audio loading error:', e);
            });

            audio.addEventListener('loadeddata', () => {
            });
        });
    }
    
    /**
     * Plays menu background music and stops any currently playing music
     * @function playMenuMusic
     * @returns {void}
     */
    playMenuMusic() {
        this.stopCurrentMusic();
        this.currentMusic = this.audio.menuMusic;

        if (this.musicEnabled) {
            this.playWithFallback(this.currentMusic);
        }
    }

    /**
     * Plays game background music and stops any currently playing music
     * @function playGameMusic
     * @returns {void}
     */
    playGameMusic() {
        this.stopCurrentMusic();
        this.currentMusic = this.audio.gameMusic;

        if (this.musicEnabled) {
            this.playWithFallback(this.currentMusic);
        }
    }
    
    /**
     * Stops and resets the currently playing music to the beginning
     * @function stopCurrentMusic
     * @returns {void}
     */
    stopCurrentMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
    }
    
    /**
     * Pauses the currently playing music without resetting its position
     * @function pauseMusic
     * @returns {void}
     */
    pauseMusic() {
        if (this.currentMusic && !this.currentMusic.paused) {
            this.currentMusic.pause();
        }
    }
    
    /**
     * Resumes paused music if music is enabled
     * @function resumeMusic
     * @returns {void}
     */
    resumeMusic() {
        if (this.currentMusic && this.currentMusic.paused && this.musicEnabled) {
            this.playWithFallback(this.currentMusic);
        }
    }
    
    /**
     * Toggles music on or off, saves the state to localStorage and returns the new music state
     * @function toggleMusic
     * @returns {boolean} The new music enabled state
     */
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        this.saveMusicState();

        if (this.musicEnabled) {
            this.resumeMusic();
        } else {
            this.pauseMusic();
        }

        return this.musicEnabled;
    }
    
    /**
     * Sets the volume for all audio files with a value between 0.0 and 1.0
     * @function setVolume
     * @param {number} volume - Volume level between 0.0 (muted) and 1.0 (full volume)
     * @returns {void}
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));

        Object.values(this.audio).forEach(audio => {
            audio.volume = this.volume;
        });
    }
    
    /**
     * Plays audio with fallback handling for browser autoplay restrictions
     * @function playWithFallback
     * @param {HTMLAudioElement} audio - The audio element to play
     * @returns {void}
     */
    playWithFallback(audio) {
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => this.logAudioPlaying(audio))
                .catch((error) => this.handleAutoplayPrevented(audio, error));
        }
    }

    /**
     * Logs successful audio playback to console
     * @function logAudioPlaying
     * @param {HTMLAudioElement} audio - The audio element that started playing
     * @returns {void}
     */
    logAudioPlaying(audio) {
    }

    /**
     * Handles browser autoplay prevention by setting up user interaction listeners
     * @function handleAutoplayPrevented
     * @param {HTMLAudioElement} audio - The audio element that failed to play
     * @param {Error} error - The autoplay prevention error
     * @returns {void}
     */
    handleAutoplayPrevented(audio, error) {
        this.setupPlayAfterInteraction(audio);
    }

    /**
     * Sets up event listeners to play audio after user interaction
     * @function setupPlayAfterInteraction
     * @param {HTMLAudioElement} audio - The audio element to play after interaction
     * @returns {void}
     */
    setupPlayAfterInteraction(audio) {
        const playAfterInteraction = () => {
            this.tryPlayAfterInteraction(audio, playAfterInteraction);
        };

        document.addEventListener('click', playAfterInteraction, { once: true });
        document.addEventListener('touchstart', playAfterInteraction, { once: true });
    }

    /**
     * Attempts to play audio after user interaction and removes event listeners
     * @function tryPlayAfterInteraction
     * @param {HTMLAudioElement} audio - The audio element to play
     * @param {Function} handler - The event handler function to remove
     * @returns {void}
     */
    tryPlayAfterInteraction(audio, handler) {
        if (this.musicEnabled && this.currentMusic === audio) {
            audio.play().then(() => {
            });
        }
        document.removeEventListener('click', handler);
        document.removeEventListener('touchstart', handler);
    }
    
    /**
     * Cleans up audio resources by stopping music and clearing audio sources
     * @function cleanup
     * @returns {void}
     */
    cleanup() {
        this.stopCurrentMusic();
        Object.values(this.audio).forEach(audio => {
            audio.src = '';
            audio.load();
        });
    }
}

let audioManager = null;

/**
 * Initializes the AudioManager instance after DOM content is loaded
 * @function DOMContentLoaded
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', function() {
    audioManager = new AudioManager();
    
    window.audioManager = audioManager;
});