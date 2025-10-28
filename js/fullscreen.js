/**
 * Fullscreen and Orientation Management for Mobile
 * Handles Portrait/Landscape detection and Fullscreen mode
 */

document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;

    // Check orientation and fullscreen status
    function checkOrientation() {
        const isMobile = isMobileDevice();
        const isLandscape = window.innerWidth > window.innerHeight;
        const isInFullscreen = document.fullscreenElement ||
                               document.webkitFullscreenElement ||
                               document.mozFullScreenElement ||
                               document.msFullscreenElement;

        if (isInFullscreen) {
            // In fullscreen mode - check orientation
            if (isMobile && !isLandscape) {
                // Portrait in fullscreen - pause game and show warning
                body.classList.add('portrait-warning');
                if (typeof world !== 'undefined' && world && !world.isPaused) {
                    world.isPaused = true;
                    console.log('Game paused: Portrait mode in fullscreen');
                }
            } else {
                // Landscape in fullscreen - resume game
                body.classList.remove('portrait-warning');
                if (typeof world !== 'undefined' && world && world.isPaused && !menu.isActive) {
                    // Only unpause if menu is not active
                    world.isPaused = false;
                    console.log('Game resumed: Landscape mode');
                }
            }
        } else {
            // Not in fullscreen
            body.classList.remove('portrait-warning');
            body.classList.remove('fullscreen-mode');
        }
    }

    // Enter fullscreen mode
    function enterGameFullscreen(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const element = document.documentElement;

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }

        // Add fullscreen class for styling
        body.classList.add('fullscreen-mode');

        // Check orientation after entering fullscreen
        setTimeout(checkOrientation, 100);

        // Hide address bar on mobile
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 200);
    }

    // Exit fullscreen mode
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }

        // Remove fullscreen class
        body.classList.remove('fullscreen-mode');
        body.classList.remove('portrait-warning');
    }

    // Note: Automatic fullscreen removed - user decides when to enter fullscreen

    // Auto-detect orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(checkOrientation, 500);
    });

    window.addEventListener('resize', function() {
        setTimeout(checkOrientation, 100);
    });

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);

    function onFullscreenChange() {
        const isInFullscreen = document.fullscreenElement ||
                               document.webkitFullscreenElement ||
                               document.mozFullScreenElement ||
                               document.msFullscreenElement;

        if (!isInFullscreen) {
            // Exited fullscreen
            body.classList.remove('fullscreen-mode');
            body.classList.remove('portrait-warning');
            console.log('Exited fullscreen');
        } else {
            console.log('Entered fullscreen');
        }

        checkOrientation();
    }

    // Listen for ESC key to exit fullscreen
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && document.fullscreenElement) {
            exitFullscreen();
        }
    });

    // Initial check
    setTimeout(checkOrientation, 100);

    console.log('Fullscreen system initialized');
});
