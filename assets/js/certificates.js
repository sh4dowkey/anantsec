
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
    certificatesSection.style.animation = 'fadeIn 0.6s ease forwards';
  }
}

// Create certificate card
function createCard(item, type) {
  const card = document.createElement('div');
  card.className = 'cert-card';
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View ${item.title} certificate`);

  // --- 1. Image Section ---
  const imageContainer = document.createElement('div');
  imageContainer.className = 'cert-image-container';

  const badge = document.createElement('div');
  badge.className = 'cert-badge';
  badge.textContent = type;
  imageContainer.appendChild(badge);

  const img = document.createElement('img');
  img.src = `assets/certificates/${item.file}`;
  img.alt = `${item.title} certificate`;
  img.loading = 'lazy';
  
  img.onerror = function() {
    this.src = 'assets/img/placeholder-cert.png'; 
  };

  // Fullscreen click handler
  const openModal = (e) => {
    e.preventDefault();
    openFullscreenModal(img.src, item.title);
  };
  
  img.addEventListener('click', openModal);
  card.addEventListener('click', openModal);
  
  // Keyboard accessibility
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(e);
    }
  });

  imageContainer.appendChild(img);
  card.appendChild(imageContainer);

  // --- 2. Content Section ---
  const content = document.createElement('div');
  content.className = 'cert-content';

  // Title
  const title = document.createElement('h3');
  title.className = 'cert-title';
  title.textContent = item.title || 'Certificate';
  title.title = item.title; // Tooltip for truncated text

  // Issuer (Footer)
  const issuer = document.createElement('div'); 
  issuer.className = 'cert-issuer';
  issuer.innerHTML = `<i class="fas fa-building" aria-hidden="true"></i> <span>${item.issuer || 'Unknown'}</span>`;

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
  
  if (!modal || !modalImage) return;

  focusedElementBeforeModal = document.activeElement;
  
  modalImage.src = src;
  modalImage.alt = `Fullscreen view of ${title}`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  cleanupFocusTrap = trapFocus(modal);
  
  setTimeout(() => {
    const closeBtn = document.querySelector('.modal-close');
    if(closeBtn) closeBtn.focus();
  }, 50);
  
  announceToScreenReader(`Certificate ${title} opened in fullscreen.`);
}

// Close fullscreen modal
function closeFullscreenModal() {
  const modal = document.getElementById('modal');
  const modalImage = document.getElementById('modal-image');
  
  if (!modal) return;

  modal.classList.remove('active');
  if (modalImage) modalImage.src = '';
  document.body.style.overflow = '';
  
  if (cleanupFocusTrap) cleanupFocusTrap();
  if (focusedElementBeforeModal) focusedElementBeforeModal.focus();
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

function announceToScreenReader(message) {
  const existing = document.getElementById('sr-announcement');
  if (existing) existing.remove();

  const announcement = document.createElement('div');
  announcement.id = 'sr-announcement';
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
}

// Load certificates directly from JSON with custom ordering
async function loadCertificates() {
  showLoadingState();
  
  try {
    const response = await fetch('data/certificates.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    setTimeout(() => {
      const certGrid = document.getElementById('certificates-grid');
      const jobsimGrid = document.getElementById('jobsim-grid');
      const badgeGrid = document.getElementById('badges-grid');
      
      const clearAndPopulate = (grid, items, type) => {
        if (grid) {
          grid.innerHTML = '';
          if (items && items.length > 0) {
            // Sort items based on the 'order' field. 
            // If 'order' is missing, it defaults to the end (999).
            const sortedItems = [...items].sort((a, b) => (a.order || 999) - (b.order || 999));
            
            sortedItems.forEach(item => grid.appendChild(createCard(item, type)));
          } else {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">No ${type.toLowerCase()}s found.</div>`;
          }
        }
      };

      // Populate grids using sorted data from JSON
      clearAndPopulate(certGrid, data.certificates, 'Certified');
      clearAndPopulate(jobsimGrid, data.jobsim, 'Simulation');
      clearAndPopulate(badgeGrid, data.badges, 'Badge');
      
      showContent();
      
      const totalCount = (data.certificates?.length || 0) + (data.jobsim?.length || 0) + (data.badges?.length || 0);
      announceToScreenReader(`${totalCount} certificates loaded`);
      
    }, 300);
    
  } catch (error) {
    console.error('❌ Failed to load certificates:', error);
    showErrorState('Unable to load certificates. Please try refreshing the page.');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadCertificates();

  const modal = document.getElementById('modal');
  const modalClose = document.querySelector('.modal-close') || document.getElementById('modal-close');

  if (modalClose) modalClose.addEventListener('click', closeFullscreenModal);
  if (modal) modal.addEventListener('click', (e) => { 
    if (e.target === modal) closeFullscreenModal(); 
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeFullscreenModal();
    }
  });
});