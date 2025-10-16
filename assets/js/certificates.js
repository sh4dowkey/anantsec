// === assets/js/certificates.js - COMPLETE REWRITE ===

// Show loading state
function showLoadingState() {
  const loadingState = document.getElementById('loading-state');
  const certificatesSection = document.getElementById('certificates-section');
  
  if (loadingState) loadingState.style.display = 'block';
  if (certificatesSection) certificatesSection.style.display = 'none';
}

// Show error state
function showErrorState(message) {
  const loadingState = document.getElementById('loading-state');
  const container = document.querySelector('.container');
  
  if (loadingState) loadingState.remove();
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-state';
  errorDiv.setAttribute('role', 'alert');
  errorDiv.innerHTML = `
    <i class="fas fa-exclamation-triangle"></i>
    <p>${message}</p>
    <button onclick="location.reload()" class="retry-btn">
      <i class="fas fa-redo"></i> Try Again
    </button>
  `;
  
  container.appendChild(errorDiv);
}

// Hide loading and show content
function showContent() {
  const loadingState = document.getElementById('loading-state');
  const certificatesSection = document.getElementById('certificates-section');
  
  if (loadingState) loadingState.style.display = 'none';
  if (certificatesSection) {
    certificatesSection.style.display = 'block';
    certificatesSection.style.animation = 'fadeInUp 0.5s ease forwards';
  }
}

// Create certificate card
function createCard(item, type) {
  const card = document.createElement('div');
  card.className = 'cert-card';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View ${item.title} certificate`);

  const imageContainer = document.createElement('div');
  imageContainer.className = 'cert-image-container';

  const badge = document.createElement('div');
  badge.className = 'cert-badge';
  badge.textContent = type;
  badge.setAttribute('aria-label', `Badge type: ${type}`);
  imageContainer.appendChild(badge);

  const img = document.createElement('img');
  img.src = `assets/certificates/${item.file}`;
  img.alt = `${item.title} certificate`;
  img.loading = 'lazy';
  img.setAttribute('decoding', 'async');

  // Error handling for images
  img.onerror = function() {
    this.src = 'assets/img/placeholder-cert.png';
    this.alt = 'Certificate image not available';
  };

  // Click to view fullscreen
  const openModal = (e) => {
    e.preventDefault();
    openFullscreenModal(img.src, item.title);
  };

  img.addEventListener('click', openModal);
  card.addEventListener('click', openModal);
  
  // Keyboard support
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(e);
    }
  });

  imageContainer.appendChild(img);
  card.appendChild(imageContainer);

  const content = document.createElement('div');
  content.className = 'cert-content';

  const title = document.createElement('h3');
  title.className = 'cert-title';
  title.textContent = item.title || 'Certificate';

  const issuer = document.createElement('p');
  issuer.className = 'cert-issuer';
  issuer.innerHTML = `<i class="fas fa-building" aria-hidden="true"></i> ${item.issuer || 'Unknown'}`;

  content.appendChild(title);
  content.appendChild(issuer);
  card.appendChild(content);

  return card;
}

// Open fullscreen modal
let focusedElementBeforeModal;
let cleanupFocusTrap;

function openFullscreenModal(src, title) {
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modal-image');
  
  focusedElementBeforeModal = document.activeElement;
  
  modalImage.src = src;
  modalImage.alt = `Fullscreen view of ${title}`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Trap focus in modal
  cleanupFocusTrap = trapFocus(modal);
  
  // Focus close button
  setTimeout(() => {
    document.getElementById('modal-close').focus();
  }, 100);
  
  // Announce to screen readers
  announceToScreenReader(`Certificate ${title} opened in fullscreen. Press Escape to close.`);
}

// Close fullscreen modal
function closeFullscreenModal() {
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modal-image');
  
  modal.classList.remove('active');
  modalImage.src = '';
  document.body.style.overflow = '';
  
  // Remove focus trap
  if (cleanupFocusTrap) cleanupFocusTrap();
  
  // Return focus
  if (focusedElementBeforeModal) {
    focusedElementBeforeModal.focus();
  }
}

// Focus trap utility
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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

// Announce to screen readers
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
}

// Load certificates
async function loadCertificates() {
  showLoadingState();
  
  try {
    const response = await fetch('data/certificates.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Small delay for smooth transition
    setTimeout(() => {
      const certGrid = document.getElementById('certificates-grid');
      const jobsimGrid = document.getElementById('jobsim-grid');
      const badgeGrid = document.getElementById('badges-grid');
      
      // Clear grids
      if (certGrid) certGrid.innerHTML = '';
      if (jobsimGrid) jobsimGrid.innerHTML = '';
      if (badgeGrid) badgeGrid.innerHTML = '';
      
      // Render certificates
      if (data.certificates && data.certificates.length > 0) {
        data.certificates.forEach(cert => {
          if (certGrid) certGrid.appendChild(createCard(cert, 'Certified'));
        });
      } else {
        if (certGrid) certGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">No certificates available</p>';
      }
      
      // Render job simulations
      if (data.jobsim && data.jobsim.length > 0) {
        data.jobsim.forEach(jobsim => {
          if (jobsimGrid) jobsimGrid.appendChild(createCard(jobsim, 'Simulation'));
        });
      } else {
        if (jobsimGrid) jobsimGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">No job simulations available</p>';
      }
      
      // Render badges
      if (data.badges && data.badges.length > 0) {
        data.badges.forEach(badge => {
          if (badgeGrid) badgeGrid.appendChild(createCard(badge, 'Badge'));
        });
      } else {
        if (badgeGrid) badgeGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">No badges available</p>';
      }
      
      showContent();
      
      // Announce to screen readers
      const totalCount = (data.certificates?.length || 0) + (data.jobsim?.length || 0) + (data.badges?.length || 0);
      announceToScreenReader(`${totalCount} certificates and achievements loaded`);
      
    }, 300);
    
  } catch (error) {
    console.error('❌ Failed to load certificates:', error);
    showErrorState('⚠️ Failed to load certificates. Please try again later.');
  }
}

// Modal event listeners
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');

if (modalClose) {
  modalClose.addEventListener('click', closeFullscreenModal);
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeFullscreenModal();
    }
  });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
    closeFullscreenModal();
  }
});

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCertificates);
} else {
  loadCertificates();
}