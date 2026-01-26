// Fullscreen functionality
const fullscreenOverlay = document.getElementById('fullscreen-overlay');
const fullscreenImage = document.getElementById('fullscreen-image');
const closeFullscreenButton = document.getElementById('close-fullscreen');
const previewImages = document.querySelectorAll('.clickable-resume');

if (fullscreenOverlay && fullscreenImage && closeFullscreenButton && previewImages.length > 0) {
    previewImages.forEach((img) => {
        img.addEventListener('click', () => {
            const fullSrc = img.getAttribute('data-full');
            fullscreenImage.src = fullSrc;
            fullscreenOverlay.classList.add('active');
            document.body.classList.add('overlay-active');
        });
    });

    const closeFullscreen = () => {
        fullscreenOverlay.classList.remove('active');
        fullscreenImage.src = '';
        document.body.classList.remove('overlay-active');
    };

    closeFullscreenButton.addEventListener('click', closeFullscreen);

    fullscreenOverlay.addEventListener('click', (e) => {
        if (e.target === fullscreenOverlay) {
            closeFullscreen();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenOverlay.classList.contains('active')) {
            closeFullscreen();
        }
    });
}