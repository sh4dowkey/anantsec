// === main.js - Enhanced Version ===

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initTypingEffect();
  initSvgIconAnimation();
  initResumeImageFullscreen();
  initAccessibility();
  logPerformanceMetrics();
});

/**
 * Theme Toggle with localStorage persistence
 */
function initThemeToggle() {
  const themeToggle = document.querySelector(".theme-icon");

  // Apply saved theme on load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  // Add click listener for theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light");
      const currentTheme = document.body.classList.contains("light") ? "light" : "dark";
      localStorage.setItem("theme", currentTheme);
      
      // Update theme icon text for accessibility
      themeToggle.setAttribute('aria-label', `Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`);
    });
    
    // Set initial aria-label
    const currentTheme = document.body.classList.contains("light") ? "light" : "dark";
    themeToggle.setAttribute('aria-label', `Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`);
  }
}

/**
 * Typing Effect for Hero Section
 */
function initTypingEffect() {
  const typedTextSpan = document.querySelector(".typed-text");
  const cursorSpan = document.querySelector(".cursor");

  if (!typedTextSpan || !cursorSpan) {
    return;
  }

  const textArray = [
    "Hi, I am Anant",
    "[anant@root]# ./exploit.sh",
    ">> Initiating Recon_Protocol 🛰️",
    ":: BugBounty >> Active 🐞",
    "h4ck3r_m0d3_enabled",
    "defend > attack && adapt",
    "C:\\Users\\Anant>_whoami",
    "/anantsec:~$ sudo elevate",
    "access_granted@anantsec.dev",
    "> echo 'pwnd!' | netcat",
    "{404} logic not found",
    "<injecting_payload>...",
    "[+] Shell obtained",
    ">> echo $FLAG > ~/success.txt",
    "🛡️ ethical_hack.exe"
  ];
  
  const typingDelay = 65;
  const erasingDelay = 50;
  const newTextDelay = 1500;
  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      setTimeout(type, typingDelay + 500);
    }
  }

  setTimeout(type, 1000);
}

/**
 * SVG Icon Animation for Logo
 */
function initSvgIconAnimation() {
  const svgContainer = document.getElementById('svg-icon');

  if (!svgContainer) {
    return;
  }

  const svgIcons = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 4h16v2H4zm0 4h10v2H4zm0 4h16v2H4zm0 4h10v2H4z"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C7.03 2 3 6.03 3 11c0 4.64 3.41 8.47 8 8.94V22h2v-2.06c4.59-.47 8-4.3 8-8.94 0-4.97-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7 0-3.86 3.14-7 7-7s7 3.14 7 7c0 3.86-3.14 7-7 7z"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2a9.93 9.93 0 0 0-7.07 2.93A10.01 10.01 0 0 0 2 12c0 2.21.71 4.25 1.93 5.93L2 22l4.07-1.93A9.93 9.93 0 0 0 12 22a10 10 0 1 0 0-20z"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.25 3.25 10 9 12 5.75-2 9-6.75 9-12V5l-9-4z"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 2v2h6V2h2v2h3a1 1 0 0 1 1 1v3h-2V6H5v2H3V5a1 1 0 0 1 1-1h3V2h2zm12 10v2h-2v-2h2zM5 12v2H3v-2h2zm6 7v2H9v-2h6v2h-2v-2h-2z"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-6h-2v4h2v-4z"/></svg>`
  ];

  function changeIcon() {
    const randomIcon = svgIcons[Math.floor(Math.random() * svgIcons.length)];
    svgContainer.innerHTML = randomIcon;
  }

  changeIcon();
  setInterval(changeIcon, 2000);
}

/**
 * Resume Image Fullscreen Viewer
 */
function initResumeImageFullscreen() {
  const fullscreenOverlay = document.getElementById('fullscreen-overlay');
  const fullscreenImage = document.getElementById('fullscreen-image');
  const closeFullscreenButton = document.getElementById('close-fullscreen');
  const previewImages = document.querySelectorAll('.clickable-resume');

  if (!fullscreenOverlay || !fullscreenImage || !closeFullscreenButton || previewImages.length === 0) {
    return;
  }

  previewImages.forEach((img) => {
    img.addEventListener('click', () => {
      const fullSrc = img.getAttribute('data-full');
      fullscreenImage.src = fullSrc;
      fullscreenOverlay.classList.add('active');
      document.body.classList.add('overlay-active');
      
      // Set focus to close button for accessibility
      setTimeout(() => closeFullscreenButton.focus(), 100);
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

/**
 * Accessibility Enhancements
 */
function initAccessibility() {
  // Add keyboard navigation for hamburger menu
  const menuToggle = document.getElementById('menu-toggle');
  const menuIcon = document.querySelector('.menu-icon');
  
  if (menuIcon && menuToggle) {
    menuIcon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menuToggle.checked = !menuToggle.checked;
      }
    });
  }

  // Add focus trap for mobile menu when open
  const navRight = document.querySelector('.nav-right');
  if (navRight && menuToggle) {
    menuToggle.addEventListener('change', () => {
      if (menuToggle.checked) {
        const focusableElements = navRight.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    });
  }

  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll('.nav-right a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuToggle && menuToggle.checked) {
        menuToggle.checked = false;
      }
    });
  });

  // Add reduced motion detection
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduce-motion');
  }
}

/**
 * Performance Monitoring
 */
function logPerformanceMetrics() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        console.log('⚡ Performance Metrics:');
        console.log(`├─ Page Load: ${pageLoadTime}ms`);
        console.log(`├─ Server Response: ${connectTime}ms`);
        console.log(`└─ DOM Render: ${renderTime}ms`);

        // Optional: Send to analytics
        if (pageLoadTime > 3000) {
          console.warn('⚠️ Page load time exceeds 3 seconds');
        }
      }, 0);
    });
  }
}

/**
 * Utility: Debounce Function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Handle External Links (Open in new tab with security)
 */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && link.hostname !== window.location.hostname) {
    if (!link.hasAttribute('target')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  }
});

/**
 * Service Worker Registration (Optional - for PWA)
 */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration.scope);
      })
      .catch(error => {
        console.log('❌ Service Worker registration failed:', error);
      });
  });
}