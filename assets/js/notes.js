// === assets/js/notes.js - ENHANCED VERSION ===

// Show loading skeleton
function showNotesLoading() {
  const wrapper = document.getElementById('notes-wrapper');
  if (!wrapper) return;
  
  wrapper.innerHTML = `
    <div class="skeleton-wrapper" role="status" aria-live="polite" aria-label="Loading notes">
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
    </div>
  `;
}

// Show error state
function showNotesError(message) {
  const wrapper = document.getElementById('notes-wrapper');
  if (!wrapper) return;
  
  wrapper.innerHTML = `
    <div class="error-state" role="alert">
      <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
      <p>${message}</p>
      <button onclick="loadNotes()" class="retry-btn">
        <i class="fas fa-redo" aria-hidden="true"></i> Try Again
      </button>
    </div>
  `;
}

// Render notes grouped by year
function renderNotes(data) {
  const wrapper = document.getElementById('notes-wrapper');
  if (!wrapper) return;
  
  if (data.length === 0) {
    wrapper.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: #888;">
        <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
        <p>No notes available yet. Check back soon!</p>
      </div>
    `;
    return;
  }
  
  // Group notes by year
  const grouped = {};
  data.forEach(note => {
    const year = new Date(note.date).getFullYear();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(note);
  });
  
  // Clear wrapper
  wrapper.innerHTML = '';
  
  // Render each year group
  Object.keys(grouped).sort((a, b) => b - a).forEach((year, yearIndex) => {
    const group = document.createElement('div');
    group.className = 'notes-group';
    group.style.animation = `fadeInUp 0.5s ease forwards ${yearIndex * 0.1}s`;
    group.style.opacity = '0';
    
    const heading = document.createElement('h2');
    heading.textContent = year;
    group.appendChild(heading);
    
    grouped[year].forEach((note, noteIndex) => {
      const entry = document.createElement('div');
      entry.className = 'note-entry';
      entry.style.animation = `fadeInUp 0.3s ease forwards ${(yearIndex * 0.1) + (noteIndex * 0.05)}s`;
      entry.style.opacity = '0';
      
      const link = document.createElement('a');
      link.href = note.url;
      link.download = '';
      link.textContent = note.name;
      link.setAttribute('aria-label', `Download ${note.name}`);
      
      const date = document.createElement('span');
      date.className = 'note-date';
      date.textContent = note.date;
      
      entry.appendChild(link);
      entry.appendChild(date);
      group.appendChild(entry);
    });
    
    wrapper.appendChild(group);
  });
  
  // Announce to screen readers
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = `${data.length} notes loaded`;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
}

// Load notes with error handling
function loadNotes() {
  showNotesLoading();
  
  fetch('data/notes.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Small delay to show loading state
      setTimeout(() => {
        renderNotes(data);
      }, 300);
    })
    .catch(error => {
      console.error('❌ Error loading notes:', error);
      showNotesError('⚠️ Failed to load notes. Please try again later.');
    });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNotes);
} else {
  loadNotes();
}