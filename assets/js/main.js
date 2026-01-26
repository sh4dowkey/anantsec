
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initTypingEffect();
  initSvgIconAnimation();
  initResumeImageFullscreen();
  initAccessibility();
  initServiceWorker();
  logPerformanceMetrics();
  initExternalLinks();
});

/**
 * Theme Toggle with localStorage persistence and smooth transition
 */
function initThemeToggle() {
  const themeToggle = document.querySelector(".theme-icon");
  if (!themeToggle) return;

  // Apply saved theme on load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  // Update aria-label
  const updateAriaLabel = () => {
    const currentTheme = document.body.classList.contains("light") ? "light" : "dark";
    themeToggle.setAttribute('aria-label', `Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`);
    themeToggle.setAttribute('role', 'button');
    themeToggle.setAttribute('tabindex', '0');
  };

  updateAriaLabel();

  // Toggle theme
  const toggleTheme = () => {
    document.body.classList.toggle("light");
    const currentTheme = document.body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("theme", currentTheme);
    updateAriaLabel();
    
    // Announce to screen readers
    announceToScreenReader(`Theme changed to ${currentTheme} mode`);
  };

  themeToggle.addEventListener("click", toggleTheme);
  
  // Keyboard support
  themeToggle.addEventListener("keydown", (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

/**
 * Enhanced Typing Effect with cursor blink
 */
function initTypingEffect() {
  const typedTextSpan = document.querySelector(".typed-text");
  const cursorSpan = document.querySelector(".cursor");

  if (!typedTextSpan || !cursorSpan) return;

  const textArray = [
    "Hello! Welcome to my space. ✨",
    "Cybersecurity Researcher 🛡️",
    "Developer & Bug Hunter 🐞",
    "Turning coffee into secure code. ☕",
    "Finding bugs, making friends. 🤝",
    "Building things, then breaking them. 🔨",
    "git commit -m 'It works! (Mostly)'",
    "Searching for zero-days. 🔍",
    "Security is a journey, not a task. 🚀",
    "system.status = 'All good!' ✅",
    "Stay curious. Stay secure. 💻"
];

  const typingDelay = 65;
  const erasingDelay = 50;
  const newTextDelay = 1500;
  let textArrayIndex = 0;
  let charIndex = 0;
  let isTyping = false;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      if (!isTyping) {
        cursorSpan.style.animation = 'none';
        isTyping = true;
      }
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      isTyping = false;
      cursorSpan.style.animation = '';
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

  // Start typing after a delay
  setTimeout(type, 1000);
}

/**
 * SVG Icon Animation with better performance
 */
function initSvgIconAnimation() {
  const svgContainer = document.getElementById('svg-icon');
  if (!svgContainer) return;

  const svgIcons = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v2H4zm0 4h10v2H4zm0 4h16v2H4zm0 4h10v2H4z"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C7.03 2 3 6.03 3 11c0 4.64 3.41 8.47 8 8.94V22h2v-2.06c4.59-.47 8-4.3 8-8.94 0-4.97-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7 0-3.86 3.14-7 7-7s7 3.14 7 7c0 3.86-3.14 7-7 7z"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a9.93 9.93 0 0 0-7.07 2.93A10.01 10.01 0 0 0 2 12c0 2.21.71 4.25 1.93 5.93L2 22l4.07-1.93A9.93 9.93 0 0 0 12 22a10 10 0 1 0 0-20z"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1L3 5v6c0 5.25 3.25 10 9 12 5.75-2 9-6.75 9-12V5l-9-4z"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 2v2h6V2h2v2h3a1 1 0 0 1 1 1v3h-2V6H5v2H3V5a1 1 0 0 1 1-1h3V2h2zm12 10v2h-2v-2h2zM5 12v2H3v-2h2zm6 7v2H9v-2h6v2h-2v-2h-2z"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-6h-2v4h2v-4z"/></svg>`
  ];

  let currentIndex = 0;

  function changeIcon() {
    const randomIcon = svgIcons[currentIndex];
    svgContainer.innerHTML = randomIcon;
    currentIndex = (currentIndex + 1) % svgIcons.length;
  }

  changeIcon();
  setInterval(changeIcon, 2000);
}

/**
 * Resume Image Fullscreen Viewer with keyboard support
 */
function initResumeImageFullscreen() {
  const fullscreenOverlay = document.getElementById('fullscreen-overlay');
  const fullscreenImage = document.getElementById('fullscreen-image');
  const closeFullscreenButton = document.getElementById('close-fullscreen');
  const previewImages = document.querySelectorAll('.clickable-resume');

  if (!fullscreenOverlay || !fullscreenImage || !closeFullscreenButton || previewImages.length === 0) {
    return;
  }

  let focusedElementBeforeModal;
  let cleanupFocusTrap;

  const openFullscreen = (imgSrc) => {
    focusedElementBeforeModal = document.activeElement;
    fullscreenImage.src = imgSrc;
    fullscreenOverlay.classList.add('active');
    document.body.classList.add('overlay-active');
    
    // Trap focus
    cleanupFocusTrap = trapFocus(fullscreenOverlay);
    
    // Set focus to close button
    setTimeout(() => closeFullscreenButton.focus(), 100);
    
    // Announce to screen readers
    announceToScreenReader('Image opened in fullscreen. Press Escape to close.');
  };

  const closeFullscreen = () => {
    fullscreenOverlay.classList.remove('active');
    fullscreenImage.src = '';
    document.body.classList.remove('overlay-active');
    
    // Remove focus trap
    if (cleanupFocusTrap) cleanupFocusTrap();
    
    // Return focus
    if (focusedElementBeforeModal) {
      focusedElementBeforeModal.focus();
    }
  };

  previewImages.forEach((img) => {
    img.addEventListener('click', () => {
      const fullSrc = img.getAttribute('data-full');
      openFullscreen(fullSrc);
    });
    
    // Keyboard support
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const fullSrc = img.getAttribute('data-full');
        openFullscreen(fullSrc);
      }
    });
  });

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
  // Hamburger menu keyboard support
  const menuToggle = document.getElementById('menu-toggle');
  const menuIcon = document.querySelector('.menu-icon');

  if (menuIcon && menuToggle) {
    menuIcon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menuToggle.checked = !menuToggle.checked;
        
        // Announce to screen readers
        const state = menuToggle.checked ? 'opened' : 'closed';
        announceToScreenReader(`Menu ${state}`);
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

  // Detect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduce-motion');
  }
  
  // Skip to main content link
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content') || document.querySelector('main');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Service Worker Registration
 */
function initServiceWorker() {
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

        if (pageLoadTime > 3000) {
          console.warn('⚠️ Page load time exceeds 3 seconds');
        }
      }, 0);
    });
  }
}

/**
 * Handle External Links (security)
 */
function initExternalLinks() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.hostname !== window.location.hostname) {
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    }
  });
}

/**
 * Utility: Focus Trap for Modals
 */
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return () => {};
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  
  return () => element.removeEventListener('keydown', handleKeyDown);
}

/**
 * Announce to screen readers
 */
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
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