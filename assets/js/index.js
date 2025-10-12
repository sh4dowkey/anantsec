// Set --vh variable for mobile viewport height
function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setVh();
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);

// Optimize particle count based on screen size
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 30 : 60;

particlesJS('particles-js', {
  particles: {
    number: {
      value: particleCount,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: { value: '#66ccff' },
    shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
    opacity: { value: 0.4, random: true, anim: { enable: true, speed: 1, opacity_min: 0.15, sync: false } },
    size: { value: 2.5, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
    line_linked: { enable: true, distance: 150, color: '#66ccff', opacity: 0.25, width: 1 },
    move: { enable: true, speed: isMobile ? 0.5 : 1, random: true, out_mode: 'out' }
  },
  interactivity: {
    detect_on: 'canvas',
    events: { onhover: { enable: !isMobile, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
    modes: { grab: { distance: 140, line_linked: { opacity: 0.4 } }, push: { particles_nb: 3 } }
  },
  retina_detect: true
});

// Update theme
function updateParticlesTheme() {
  if (pJSDom && pJSDom[0]) {
    if (document.body.classList.contains('light')) {
      pJSDom[0].pJS.particles.color.value = '#555555';
      pJSDom[0].pJS.particles.line_linked.color = '#555555';
      pJSDom[0].pJS.particles.opacity.value = 0.5;
      pJSDom[0].pJS.particles.line_linked.opacity = 0.35;
    } else {
      pJSDom[0].pJS.particles.color.value = '#66ccff';
      pJSDom[0].pJS.particles.line_linked.color = '#66ccff';
      pJSDom[0].pJS.particles.opacity.value = 0.4;
      pJSDom[0].pJS.particles.line_linked.opacity = 0.25;
    }
    pJSDom[0].pJS.fn.particlesRefresh();
  }
}

const observer = new MutationObserver(updateParticlesTheme);
observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });