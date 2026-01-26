
function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVh();

// Debounced resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(setVh, 150);
});

window.addEventListener('orientationchange', setVh);

// Optimize particle count based on screen size and performance
const isMobile = window.innerWidth < 768;
const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
const particleCount = isMobile ? 30 : (isLowEnd ? 40 : 60);

// Initialize particles with error handling
try {
  particlesJS('particles-js', {
    particles: {
      number: {
        value: particleCount,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: { 
        value: '#66ccff' 
      },
      shape: { 
        type: 'circle', 
        stroke: { 
          width: 0, 
          color: '#000000' 
        } 
      },
      opacity: { 
        value: 0.4, 
        random: true, 
        anim: { 
          enable: true, 
          speed: 1, 
          opacity_min: 0.15, 
          sync: false 
        } 
      },
      size: { 
        value: 2.5, 
        random: true, 
        anim: { 
          enable: true, 
          speed: 2, 
          size_min: 0.1, 
          sync: false 
        } 
      },
      line_linked: { 
        enable: true, 
        distance: 150, 
        color: '#66ccff', 
        opacity: 0.25, 
        width: 1 
      },
      move: { 
        enable: true, 
        speed: isMobile ? 0.5 : 1, 
        direction: 'none',
        random: true, 
        straight: false,
        out_mode: 'out',
        bounce: false
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { 
        onhover: { 
          enable: !isMobile, 
          mode: 'grab' 
        }, 
        onclick: { 
          enable: true, 
          mode: 'push' 
        }, 
        resize: true 
      },
      modes: { 
        grab: { 
          distance: 140, 
          line_linked: { 
            opacity: 0.4 
          } 
        }, 
        push: { 
          particles_nb: 3 
        } 
      }
    },
    retina_detect: true
  });
  
  console.log('✅ Particles initialized successfully');
} catch (error) {
  console.error('❌ Particles initialization failed:', error);
}

// Update particles theme on theme toggle
function updateParticlesTheme() {
  if (typeof pJSDom !== 'undefined' && pJSDom && pJSDom[0]) {
    try {
      const isLight = document.body.classList.contains('light');
      
      if (isLight) {
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
    } catch (error) {
      console.error('❌ Failed to update particles theme:', error);
    }
  }
}

// Observe theme changes
const themeObserver = new MutationObserver(updateParticlesTheme);
themeObserver.observe(document.body, { 
  attributes: true, 
  attributeFilter: ['class'] 
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  themeObserver.disconnect();
});

// Performance monitoring for particles
if (window.performance && window.performance.memory) {
  setInterval(() => {
    const memory = window.performance.memory;
    const usedMemory = (memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100).toFixed(2);
    
    if (usedMemory > 90) {
      console.warn('⚠️ High memory usage detected:', usedMemory + '%');
    }
  }, 30000); // Check every 30 seconds
}